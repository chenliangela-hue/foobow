(function setupPeaceGarden() {
  const storageKey = "foobow.peaceGarden.v1";
  const copy = {
    en: { kicker: "THREE GOOD THINGS · 3 MIN", title: "Settle three good things into the water.", intro: "Recall three moments, people, or small comforts from today. Each one becomes a pebble in your quiet garden.", prompt1: "One small moment", prompt2: "Someone or something kind", prompt3: "Something you helped happen", placeholder1: "Warm sunlight, an easy laugh…", placeholder2: "A message, a helping hand…", placeholder3: "A task finished, care you gave…", privacy: "Your words stay on this page. Only your garden count is saved on this device.", settle: "Settle these moments", again: "Tend another garden", complete: "Three moments settled. Let their warmth travel with you.", count: (n) => `${n} ${n === 1 ? "garden" : "gardens"} tended` },
    "zh-Hans": { kicker: "三件美好 · 3 分钟", title: "把今天的三件美好安放在水中。", intro: "想起今天的三个瞬间、一个人，或一份小小的安慰。每一件都会化作静心石庭中的石子。", prompt1: "一个微小的美好", prompt2: "一份善意", prompt3: "一件因你而发生的好事", placeholder1: "温暖的阳光、一次轻松的笑……", placeholder2: "一条消息、一双援手……", placeholder3: "完成的事情、你给予的关怀……", privacy: "文字仅保存在此页面；此设备只会保存完成次数。", settle: "安放这些时刻", again: "再照料一座石庭", complete: "三件美好已安放。愿这份温暖陪你前行。", count: (n) => `已照料 ${n} 座石庭` },
    fr: { kicker: "TROIS BELLES CHOSES · 3 MIN", title: "Déposez trois belles choses dans l’eau.", intro: "Retrouvez trois moments, personnes ou petits réconforts d’aujourd’hui. Chacun devient un galet dans votre jardin calme.", prompt1: "Un petit moment", prompt2: "Une personne ou un geste gentil", prompt3: "Une chose que vous avez rendue possible", placeholder1: "Un rayon de soleil, un rire…", placeholder2: "Un message, une main tendue…", placeholder3: "Une tâche finie, un soin donné…", privacy: "Vos mots restent sur cette page. Seul le nombre de jardins est enregistré sur cet appareil.", settle: "Déposer ces moments", again: "Cultiver un autre jardin", complete: "Trois moments déposés. Emportez leur chaleur avec vous.", count: (n) => `${n} jardin${n > 1 ? "s" : ""} cultivé${n > 1 ? "s" : ""}` },
    es: { kicker: "TRES COSAS BUENAS · 3 MIN", title: "Deja tres cosas buenas en el agua.", intro: "Recuerda tres momentos, personas o pequeños consuelos de hoy. Cada uno será una piedra en tu jardín sereno.", prompt1: "Un pequeño momento", prompt2: "Alguien o algo amable", prompt3: "Algo que ayudaste a lograr", placeholder1: "Sol cálido, una risa fácil…", placeholder2: "Un mensaje, una mano amiga…", placeholder3: "Una tarea terminada, cuidado que diste…", privacy: "Tus palabras se quedan en esta página. Solo se guarda el número de jardines en este dispositivo.", settle: "Guardar estos momentos", again: "Cuidar otro jardín", complete: "Tres momentos guardados. Lleva su calidez contigo.", count: (n) => `${n} ${n === 1 ? "jardín cuidado" : "jardines cuidados"}` },
    th: { kicker: "สามสิ่งดี ๆ · 3 นาที", title: "วางสามสิ่งดี ๆ ลงในสายน้ำ", intro: "นึกถึงสามช่วงเวลา ผู้คน หรือความสบายใจเล็ก ๆ ในวันนี้ แต่ละสิ่งจะกลายเป็นก้อนหินในสวนสงบของคุณ", prompt1: "ช่วงเวลาเล็ก ๆ", prompt2: "คนหรือสิ่งที่มีน้ำใจ", prompt3: "สิ่งดีที่คุณช่วยให้เกิดขึ้น", placeholder1: "แสงแดดอุ่น ๆ เสียงหัวเราะ…", placeholder2: "ข้อความหนึ่ง มือที่ช่วยเหลือ…", placeholder3: "งานที่เสร็จ การดูแลที่คุณมอบให้…", privacy: "คำของคุณอยู่บนหน้านี้เท่านั้น อุปกรณ์นี้บันทึกเพียงจำนวนสวน", settle: "วางช่วงเวลาเหล่านี้", again: "ดูแลสวนอีกแห่ง", complete: "วางสามช่วงเวลาแล้ว พกความอบอุ่นนี้ไปกับคุณ", count: (n) => `ดูแลสวนแล้ว ${n} แห่ง` },
    ja: { kicker: "三つの良いこと · 3分", title: "三つの良いことを水辺に置きましょう。", intro: "今日の三つの瞬間、人、小さな安らぎを思い出してください。一つずつ静かな庭の石になります。", prompt1: "小さな良い瞬間", prompt2: "人やものからの優しさ", prompt3: "あなたが生み出した良いこと", placeholder1: "暖かな日差し、自然な笑い…", placeholder2: "メッセージ、差し伸べられた手…", placeholder3: "終えたこと、届けた思いやり…", privacy: "言葉はこのページだけに残ります。この端末には庭の回数だけを保存します。", settle: "この瞬間を置く", again: "もう一つ庭を育てる", complete: "三つの瞬間を置きました。その温かさと一緒に歩みましょう。", count: (n) => `${n} 回、庭を育てました` }
  };

  const card = document.getElementById("gratitudeGardenCard");
  const form = document.getElementById("gratitudeGardenForm");
  const pond = document.getElementById("gratitudePond");
  const settleButton = document.getElementById("settleGratitudeBtn");
  const againButton = document.getElementById("gratitudeAgainBtn");
  const status = document.getElementById("gratitudeGardenStatus");
  const count = document.getElementById("gratitudeSessionCount");
  const inputs = [...form.querySelectorAll("input")];
  if (!card || !form || !pond) return;

  function locale() {
    const lang = document.documentElement.lang;
    return lang === "zh-CN" || lang.startsWith("zh") ? "zh-Hans" : (copy[lang] ? lang : "en");
  }

  function readState() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      return { sessions: Number.isInteger(saved?.sessions) && saved.sessions >= 0 ? saved.sessions : 0 };
    } catch {
      return { sessions: 0 };
    }
  }

  function applyCopy() {
    const words = copy[locale()];
    card.querySelectorAll("[data-gratitude-i18n]").forEach((node) => {
      node.textContent = words[node.dataset.gratitudeI18n];
    });
    card.querySelectorAll("[data-gratitude-placeholder]").forEach((node) => {
      node.placeholder = words[node.dataset.gratitudePlaceholder];
    });
    count.textContent = words.count(readState().sessions);
  }

  function updateReadyState() {
    settleButton.disabled = inputs.some((input) => !input.value.trim());
  }

  function resetGarden() {
    inputs.forEach((input) => { input.value = ""; input.disabled = false; });
    pond.querySelectorAll(".gratitude-pebble").forEach((pebble) => pebble.remove());
    pond.classList.remove("celebrating");
    status.textContent = "";
    settleButton.hidden = false;
    settleButton.disabled = true;
    againButton.hidden = true;
    inputs[0].focus();
  }

  inputs.forEach((input) => input.addEventListener("input", updateReadyState));
  againButton.addEventListener("click", resetGarden);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const moments = inputs.map((input) => input.value.trim().slice(0, 72));
    if (moments.some((moment) => !moment)) return;

    pond.querySelectorAll(".gratitude-pebble").forEach((pebble) => pebble.remove());
    moments.forEach((moment) => {
      const pebble = document.createElement("span");
      pebble.className = "gratitude-pebble";
      pebble.textContent = moment;
      pond.append(pebble);
    });
    pond.classList.add("celebrating");
    inputs.forEach((input) => { input.disabled = true; });
    const next = { sessions: readState().sessions + 1 };
    localStorage.setItem(storageKey, JSON.stringify(next));
    count.textContent = copy[locale()].count(next.sessions);
    status.textContent = copy[locale()].complete;
    settleButton.hidden = true;
    againButton.hidden = false;
    if (typeof updateKarma === "function") updateKarma(3, againButton);
  });

  new MutationObserver(applyCopy).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  applyCopy();
  updateReadyState();
})();
