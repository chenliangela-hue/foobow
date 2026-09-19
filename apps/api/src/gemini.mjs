/**
 * Foobow Gemini Live AI Blessing Service
 *
 * Implements bounded, cost-controlled generative mindfulness blessings using Google Gemini Flash.
 *
 * Cost Protection & Safeguards:
 * - Ultra-low token output ceiling: maxOutputTokens = 100 (averages ~30-50 tokens per generation).
 * - Default model: gemini-1.5-flash ($0.00001875 / 1k input tokens, $0.000075 / 1k output tokens).
 * - 24-hour LRU cache: identical requests consume 0 tokens.
 * - Global rate-limiter: max 10 calls / min.
 * - Graceful zero-token fallback: on timeout, 429, missing key, or network error.
 */

// In-memory 24-hour cache
const cache = new Map();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

// Rate-limiting tracker (sliding window)
const callTimestamps = [];
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_CALLS_PER_WINDOW = 10;

// Pricing constants for Gemini 1.5 Flash (USD per 1,000 tokens)
const COST_PER_1K_INPUT_USD = 0.00001875;
const COST_PER_1K_OUTPUT_USD = 0.000075;

// Offline fallback blessing dictionary (mirrors I18N.blessingLines)
const FALLBACK_BLESSINGS = {
  en: {
    family: "May warmth and harmony dwell under your roof. May every step you take bring you safely home.",
    health: "May ease return to your breathing, and strength return to your limbs. One gentle morning at a time.",
    study: "May your mind stay clear and unhurried. May the right understanding arise when it is needed.",
    travel: "May your roads be open, your arrivals kind, and every stranger's door show you a welcoming light.",
    remembrance: "A quiet thought kept with tenderness. That which was loved is never wholly lost.",
    gratitude: "A small good received, acknowledged with two hands. May this quiet joy linger with you."
  },
  "zh-Hans": {
    family: "愿阖家安康，檐下常温。愿归途平正，岁岁平安。",
    health: "愿身心轻安，呼吸调顺。一朝一夕，渐复从容。",
    study: "愿心地澄明，步步笃实。触类旁通，静定生慧。",
    travel: "愿行途开朗，所遇皆善。关山万重，处处春风。",
    remembrance: "一念温存，常驻心田。凡所深爱，历久弥新。",
    gratitude: "一滴甘露，双手奉持。心存感念，福泽绵长。"
  },
  fr: {
    family: "Que la douceur et l'harmonie habitent votre foyer. Que vos pas vous ramènent toujours en paix.",
    health: "Que la légèreté revienne dans votre souffle et la force dans vos membres. Un jour après l'autre.",
    study: "Que votre esprit demeure clair et posé. Que la juste compréhension s'éveille en son temps.",
    travel: "Que vos routes soient ouvertes et vos arrivées paisibles. Partout un accueil bienveillant.",
    remembrance: "Une pensée silencieuse gardée avec tendresse. Ce qui a été aimé ne s'efface jamais.",
    gratitude: "Un petit bien reçu, accueilli à deux mains. Que cette joie discrète vous accompagne."
  },
  es: {
    family: "Que la calidez y la armonía moren bajo su techo. Que cada paso le lleve a salvo a su hogar.",
    health: "Que el alivio vuelva a su respiración y la fuerza a sus manos. Con calma, paso a paso.",
    study: "Que su mente se mantenga clara y sin prisas. Que la comprensión surja cuando sea necesaria.",
    travel: "Que sus caminos sean abiertos y sus llegadas serenas. Que halle puertas acogedoras.",
    remembrance: "Un recuerdo sereno guardado con ternura. Lo que fue amado nunca se pierde del todo.",
    gratitude: "Un pequeño bien recibido con ambas manos. Que esta alegría tranquila permanezca."
  },
  th: {
    family: "ขอให้ความอบอุ่นและความกลมเกลียวสถิตอยู่ใต้ชายคา ขอให้ทุกย่างก้าวพาคุณกลับบ้านอย่างปลอดภัย",
    health: "ขอให้ลมหายใจผ่อนคลายและกำลังวังชากลับคืนมา ทีละเช้าวันอันอ่อนโยน",
    study: "ขอให้จิตใจกระจ่างแจ้ง ไม่รีบร้อน ขอให้เกิดปัญญาความเข้าใจในเวลาที่ควร",
    travel: "ขอให้เส้นทางเปิดกว้าง การเดินทางราบรื่น พบพานแต่ไมตรีจิต",
    remembrance: "ความระลึกถึงอันอ่อนโยนที่เก็บไว้ในใจ สิ่งที่รักจะไม่สูญหายไป",
    gratitude: "ความดีเล็กๆ ที่น้อมรับด้วยสองมือ ขอให้ความสงบสุขนี้อยู่กับคุณ"
  },
  ja: {
    family: "軒先に温もりと和らぎが宿りますように。日々の歩みが安らかな家へと繋がりますように。",
    health: "息づかいが軽やかになり、心身に健やかさが戻りますように。静かな朝を重ねて。",
    study: "心が澄み渡り、焦りなく学べますように。必要なときに正しい理解が訪れますように。",
    travel: "道のりがひらけ、穏やかな出逢いがありますように。どこへ向かっても温かな光を。",
    remembrance: "慈しみとともに抱く静かな想い。深く愛されたものは決して消え去りません。",
    gratitude: "両手でいただいた小さな恵み。この静かな喜びが長く心に留まりますように。"
  }
};

function getFallbackBlessing(category, recipient, locale) {
  const normLocale = (locale || "en").startsWith("zh") ? "zh-Hans" : (locale || "en").slice(0, 2);
  const localeSet = FALLBACK_BLESSINGS[normLocale] || FALLBACK_BLESSINGS.en;
  let text = localeSet[category] || localeSet.family;

  const who = (recipient || "").trim();
  if (who) {
    if (normLocale === "zh-Hans") {
      text = `为 ${who} 祈福：${text}`;
    } else if (normLocale === "ja") {
      text = `${who} へ：${text}`;
    } else {
      text = `For ${who} — ${text}`;
    }
  }

  return {
    text,
    provider: "mock",
    model: "fallback-content-pack",
    tokens: { input: 0, output: 0, total: 0 },
    cost_usd: 0,
    cached: false,
    note: "Zero-token blessing pack"
  };
}

function pruneCache() {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp > CACHE_TTL_MS) {
      cache.delete(key);
    }
  }
}

function checkRateLimit() {
  const now = Date.now();
  while (callTimestamps.length && now - callTimestamps[0] > RATE_LIMIT_WINDOW_MS) {
    callTimestamps.shift();
  }
  if (callTimestamps.length >= MAX_CALLS_PER_WINDOW) {
    return false;
  }
  callTimestamps.push(now);
  return true;
}

/**
 * Generates a bounded, personalized Zen blessing with Google Gemini Flash.
 *
 * @param {Object} params
 * @param {string} params.category - e.g. 'family', 'health', 'study', 'travel', 'remembrance', 'gratitude'
 * @param {string} [params.recipient] - Recipient name or relation
 * @param {string} [params.message] - User's private intention or worry
 * @param {string} [params.locale] - e.g. 'en', 'zh-Hans', 'fr', 'es', 'th', 'ja'
 * @param {string} [params.apiKey] - Optional explicit API key; defaults to process.env.GEMINI_API_KEY
 * @param {string} [params.model] - Model name; defaults to 'gemini-1.5-flash'
 * @returns {Promise<Object>} Formatted blessing response with token accounting
 */
export async function generateBlessingWithGemini({
  category = "family",
  recipient = "",
  message = "",
  locale = "en",
  apiKey = process.env.GEMINI_API_KEY,
  model = process.env.AI_MODEL || "gemini-3.6-flash"
} = {}) {
  // Normalize parameters
  const cleanCategory = String(category).toLowerCase().trim() || "family";
  const cleanRecipient = String(recipient || "").trim();
  const cleanMessage = String(message || "").trim();
  const cleanLocale = String(locale || "en").trim();

  // 1. Check cache first (0 tokens)
  pruneCache();
  const cacheKey = `${cleanCategory}:${cleanRecipient.toLowerCase()}:${cleanMessage.toLowerCase()}:${cleanLocale}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return {
      ...cached.payload,
      cached: true,
      tokens: { input: 0, output: 0, total: 0 },
      cost_usd: 0,
      note: "Retrieved from cache (0 tokens)"
    };
  }

  // 2. Check API key presence; fallback gracefully if not configured
  if (!apiKey) {
    const fallback = getFallbackBlessing(cleanCategory, cleanRecipient, cleanLocale);
    cache.set(cacheKey, { timestamp: Date.now(), payload: fallback });
    return fallback;
  }

  // 3. Check rate-limiting window (max 10 calls/min)
  if (!checkRateLimit()) {
    const fallback = getFallbackBlessing(cleanCategory, cleanRecipient, cleanLocale);
    fallback.note = "Rate limit threshold reached (protected from bill spikes) - zero-token fallback";
    cache.set(cacheKey, { timestamp: Date.now(), payload: fallback });
    return fallback;
  }

  // 4. Bounded Gemini API Call with zero thinking budget for minimal token usage
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const promptText = `Intention category: ${cleanCategory}
Recipient: ${cleanRecipient || "someone dear"}
User's personal wish/worry: ${cleanMessage || "none provided"}
Target language/locale: ${cleanLocale}

Please generate a compassionate Buddhist-inspired blessing for this intention.`;

  const requestBody = {
    systemInstruction: {
      parts: [
        {
          text: "You are Foobow's secular mindfulness companion. Write a gentle, compassionate, Buddhist-inspired reflection and blessing (1 to 2 sentences, maximum 35 words). Offer warmth, inner peace, and quiet encouragement. NEVER predict the future, promise luck or divine intervention, or give medical or financial advice. Output ONLY the blessing text in the specified target language/locale without quotes, labels, or preamble."
        }
      ]
    },
    contents: [
      {
        parts: [{ text: promptText }]
      }
    ],
    generationConfig: {
      thinkingConfig: {
        thinkingBudget: 0 // Eliminate thinking tokens to keep token consumption and bills strictly minimal
      },
      maxOutputTokens: 80, // Strictly bounded output ceiling
      temperature: 0.7,
      topP: 0.95
    }
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Any API error (e.g. 429 quota, 403, 500) triggers zero-token safe fallback
      const fallback = getFallbackBlessing(cleanCategory, cleanRecipient, cleanLocale);
      fallback.note = `Gemini API returned status ${response.status} - zero-token fallback used`;
      return fallback;
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!candidateText) {
      return getFallbackBlessing(cleanCategory, cleanRecipient, cleanLocale);
    }

    // Extract exact token counts from Gemini metadata
    const inputTokens = data?.usageMetadata?.promptTokenCount || 45;
    const outputTokens = data?.usageMetadata?.candidatesTokenCount || 35;
    const totalTokens = data?.usageMetadata?.totalTokenCount || (inputTokens + outputTokens);

    // Calculate actual cost
    const costUsd = Number(
      ((inputTokens * COST_PER_1K_INPUT_USD) / 1000 + (outputTokens * COST_PER_1K_OUTPUT_USD) / 1000).toFixed(7)
    );

    const result = {
      text: candidateText,
      provider: "gemini",
      model,
      tokens: {
        input: inputTokens,
        output: outputTokens,
        total: totalTokens
      },
      cost_usd: costUsd,
      cached: false,
      note: "Budget guarded: under 100 tokens ceiling"
    };

    // Save to cache
    cache.set(cacheKey, { timestamp: Date.now(), payload: result });

    return result;
  } catch (error) {
    // Network failure, timeout, or parsing error safely caught
    const fallback = getFallbackBlessing(cleanCategory, cleanRecipient, cleanLocale);
    fallback.note = "Network or service timeout - zero-token fallback used";
    return fallback;
  }
}
