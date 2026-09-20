import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useI18n } from "../../i18n/LocaleContext";
import { layout, typography } from "../../theme/theme";
import { useThemeColors } from "../../theme/ThemeContext";
import { BlessingCategory, WishLamp } from "../../types";
import { generateBlessingIntention } from "../../services/apiClient";
import { VirtualIncense } from "./VirtualIncense";
import { SanskritChantsCard } from "./SanskritChantsCard";
import { ZenPrayerWheel } from "./ZenPrayerWheel";
import { ZenWoodenFish } from "../common/ZenWoodenFish";

const blessingCategories: BlessingCategory[] = [
  "family",
  "health",
  "study",
  "travel",
  "remembrance",
  "gratitude"
];

const sampleBlessings: Record<string, Record<BlessingCategory, string>> = {
  en: {
    family: "May your home be sheltered from harsh winds, and gentle laughter dwell in every room.",
    health: "May the body mend quietly in its own good time, with breath coming easy and unhurried.",
    study: "May quiet focus open the doors you seek, one honest step at a time.",
    travel: "May every road welcome you with safe passage and warm harbor at journey's end.",
    remembrance: "Love does not depart with breath; it lingers as quiet starlight in the heart.",
    gratitude: "In noticing the smallest gift, the whole wide world turns rich and kind."
  },
  "zh-Hans": {
    family: "愿阖家安康，风雨不侵，岁岁常欢愉，万事皆胜意。",
    health: "愿身心轻安，宿疾渐消，呼吸从容，气血如春水润泽。",
    study: "愿慧心朗照，笃行致远，字字入心，所求皆有所得。",
    travel: "愿行路平安，遇善人相伴，归途有明灯，四海皆温良。",
    remembrance: "思念化作心灯长明，所爱之人从未远去，常在心间驻留。",
    gratitude: "一念感恩，福缘自聚；常怀敬意，岁月皆泛温柔光芒。"
  }
};

type BlessingsViewProps = {
  onTapKarma: (points: number) => void;
  seniorMode?: boolean;
};

export function BlessingsView({ onTapKarma, seniorMode }: BlessingsViewProps) {
  const currentColors = useThemeColors();
  const { t, locale } = useI18n();

  const [selectedCategory, setSelectedCategory] = useState<BlessingCategory>("family");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [generatedBlessing, setGeneratedBlessing] = useState<string | null>(null);
  const [blessingSaved, setBlessingSaved] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<{
    provider: string;
    tokens?: { total: number };
    cost_usd: number;
    cached: boolean;
  } | null>(null);

  const [wishInput, setWishInput] = useState("");
  const [lamps, setLamps] = useState<WishLamp[]>([
    { id: "lamp_init_1", wish: t("blessings.lampPlaceholder"), createdAt: new Date().toISOString() }
  ]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await generateBlessingIntention({
        category: selectedCategory,
        recipient: recipient.trim(),
        message: message.trim(),
        locale
      });
      if (res.ok && res.data && res.data.text) {
        setGeneratedBlessing(res.data.text);
        setTokenInfo({
          provider: res.data.provider,
          tokens: res.data.tokens,
          cost_usd: res.data.cost_usd,
          cached: res.data.cached
        });
      } else {
        const langKey = locale.startsWith("zh") ? "zh-Hans" : "en";
        const dict = sampleBlessings[langKey] || sampleBlessings.en;
        let text = dict[selectedCategory] || dict.family;
        if (recipient.trim()) {
          text = `${recipient.trim()}：${text}`;
        }
        setGeneratedBlessing(text);
        setTokenInfo(null);
      }
    } catch {
      const langKey = locale.startsWith("zh") ? "zh-Hans" : "en";
      const dict = sampleBlessings[langKey] || sampleBlessings.en;
      let text = dict[selectedCategory] || dict.family;
      if (recipient.trim()) {
        text = `${recipient.trim()}：${text}`;
      }
      setGeneratedBlessing(text);
      setTokenInfo(null);
    } finally {
      setIsGenerating(false);
      setBlessingSaved(false);
    }
  };


  const handleSaveBlessing = () => {
    if (!blessingSaved) {
      onTapKarma(1);
      setBlessingSaved(true);
    }
  };

  const handleLightLamp = () => {
    const wish = wishInput.trim();
    if (!wish) return;
    const newLamp: WishLamp = {
      id: `lamp_${Date.now()}`,
      wish,
      createdAt: new Date().toISOString()
    };
    setLamps((prev) => [newLamp, ...prev].slice(0, 8));
    setWishInput("");
    onTapKarma(1);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerBlock}>
        <Text style={[styles.eyebrow, { color: currentColors.muted }, seniorMode && { fontSize: typography.sizes.caption }]}>
          {t("blessings.eyebrow")}
        </Text>
        <Text style={[styles.title, { color: currentColors.ink }, seniorMode && { fontSize: typography.sizes.headerSenior }]}>
          {t("blessings.title")}
        </Text>
        <Text style={[styles.copy, { color: currentColors.muted }, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
          {t("blessings.copy")}
        </Text>
      </View>

      {/* Pray for someone card */}
      <View style={[styles.card, { backgroundColor: currentColors.surface, borderColor: currentColors.cardBorder }]}>
        <Text style={[styles.cardTitle, { color: currentColors.ink }]}>
          {t("blessings.receive")}
        </Text>

        {/* Categories Chips */}
        <View style={styles.chipsRow}>
          {blessingCategories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isActive ? currentColors.jade : currentColors.surfaceStrong,
                    borderColor: isActive ? currentColors.jade : currentColors.line
                  }
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: isActive ? currentColors.surfaceStrong : currentColors.ink },
                    seniorMode && { fontSize: typography.sizes.body }
                  ]}
                >
                  {t(`blessings.categories.${cat}`)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <TextInput
          value={recipient}
          onChangeText={setRecipient}
          maxLength={40}
          placeholder={t("blessings.recipientPlaceholder")}
          placeholderTextColor={currentColors.muted}
          style={[styles.input, { color: currentColors.ink, borderColor: currentColors.line, backgroundColor: currentColors.surfaceStrong }]}
        />

        <TextInput
          value={message}
          onChangeText={setMessage}
          maxLength={160}
          multiline
          numberOfLines={2}
          placeholder={t("blessings.messagePlaceholder")}
          placeholderTextColor={currentColors.muted}
          style={[styles.input, styles.textArea, { color: currentColors.ink, borderColor: currentColors.line, backgroundColor: currentColors.surfaceStrong }]}
        />

        <Pressable
          style={[styles.primaryButton, { backgroundColor: currentColors.jade }, isGenerating && { opacity: 0.7 }]}
          disabled={isGenerating}
          onPress={handleGenerate}
        >
          {isGenerating ? (
            <ActivityIndicator size="small" color={currentColors.surfaceStrong} />
          ) : (
            <Text style={[styles.primaryButtonText, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
              {t("blessings.receive")}
            </Text>
          )}
        </Pressable>

        {generatedBlessing && (
          <View style={[styles.replyCard, { backgroundColor: currentColors.surfaceStrong, borderColor: currentColors.gold }]}>
            <Text style={[styles.replyText, { color: currentColors.ink }, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
              {generatedBlessing}
            </Text>
            <View style={styles.sourceRow}>
              <Text style={[styles.replySource, { color: currentColors.gold }]}>
                {t("blessings.source")}
              </Text>
              {tokenInfo?.provider === "gemini" && tokenInfo.tokens && tokenInfo.tokens.total > 0 ? (
                <View style={[styles.tokenBadge, { borderColor: currentColors.gold, backgroundColor: currentColors.goldGlow }]}>
                  <Text style={[styles.tokenBadgeText, { color: currentColors.gold }]}>
                    🌿 Gemini · {tokenInfo.tokens.total} tok (${tokenInfo.cost_usd.toFixed(6)})
                  </Text>
                </View>
              ) : tokenInfo?.cached ? (
                <View style={[styles.tokenBadge, { borderColor: currentColors.gold, backgroundColor: currentColors.goldGlow }]}>
                  <Text style={[styles.tokenBadgeText, { color: currentColors.gold }]}>
                    🌿 Gemini (cached · 0 tok)
                  </Text>
                </View>
              ) : null}
            </View>
            <Pressable
              disabled={blessingSaved}
              onPress={handleSaveBlessing}
              style={[
                styles.saveButton,
                { backgroundColor: blessingSaved ? currentColors.surface : currentColors.goldGlow }
              ]}
            >
              <Text style={[styles.saveButtonText, { color: currentColors.jade }]}>
                {blessingSaved ? t("blessings.saved") : t("blessings.save")}
              </Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Wish Lamp Card */}
      <View style={[styles.card, { backgroundColor: currentColors.surface, borderColor: currentColors.cardBorder }]}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={[styles.eyebrow, { color: currentColors.muted }]}>
              {t("blessings.lampEyebrow")}
            </Text>
            <Text style={[styles.cardTitle, { color: currentColors.ink }]}>
              {t("blessings.lampTitle")}
            </Text>
          </View>
          <View style={[styles.pill, { backgroundColor: currentColors.surfaceStrong, borderColor: currentColors.line }]}>
            <Text style={[styles.pillText, { color: currentColors.gold }]}>
              🪔 {t("blessings.lampsCount", { count: lamps.length })}
            </Text>
          </View>
        </View>

        <TextInput
          value={wishInput}
          onChangeText={setWishInput}
          maxLength={80}
          placeholder={t("blessings.lampPlaceholder")}
          placeholderTextColor={currentColors.muted}
          style={[styles.input, { color: currentColors.ink, borderColor: currentColors.line, backgroundColor: currentColors.surfaceStrong }]}
        />

        <Pressable
          style={[styles.primaryButton, { backgroundColor: currentColors.bamboo }]}
          onPress={handleLightLamp}
        >
          <Text style={[styles.primaryButtonText, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
            {t("blessings.lightLamp")}
          </Text>
        </Pressable>

        {lamps.map((lamp) => (
          <View key={lamp.id} style={[styles.lampItem, { borderColor: currentColors.line }]}>
            <Text style={styles.lampIcon}>🪔</Text>
            <Text style={[styles.lampWishText, { color: currentColors.ink }, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
              {lamp.wish}
            </Text>
          </View>
        ))}
      </View>

      {/* Virtual Incense (电子焚香) */}
      <VirtualIncense onKindleIncense={() => onTapKarma(1)} seniorMode={seniorMode} />

      {/* Zen Wooden Fish knocker */}
      <ZenWoodenFish onTapKarma={onTapKarma} seniorMode={seniorMode} />

      {/* Zen Prayer Wheel (菩提转经轮) */}
      <ZenPrayerWheel onSpinRevolution={() => onTapKarma(1)} seniorMode={seniorMode} />

      {/* Sanskrit Chants Player (梵音曲库 · 大悲咒) */}
      <SanskritChantsCard onCompleteMeditation={onTapKarma} seniorMode={seniorMode} />

      {/* Safety Notice */}
      <Text style={[styles.safetyText, { color: currentColors.muted }]}>
        {t("blessings.safety")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: layout.spacing.md
  },
  headerBlock: {
    gap: layout.spacing.xs
  },
  eyebrow: {
    fontSize: typography.sizes.eyebrow,
    textTransform: "uppercase",
    letterSpacing: 0.8
  },
  title: {
    fontSize: typography.sizes.header,
    fontWeight: "700",
    fontFamily: typography.fontFamilySerif
  },
  copy: {
    fontSize: typography.sizes.body,
    lineHeight: 20
  },
  card: {
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    padding: layout.spacing.md,
    gap: layout.spacing.sm
  },
  cardTitle: {
    fontSize: typography.sizes.title,
    fontWeight: "700",
    fontFamily: typography.fontFamilySerif
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: layout.spacing.xs,
    marginVertical: layout.spacing.xs
  },
  chip: {
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: layout.spacing.xs,
    borderRadius: layout.borderRadius.full,
    borderWidth: 1
  },
  chipText: {
    fontSize: typography.sizes.caption,
    fontWeight: "600"
  },
  input: {
    borderWidth: 1,
    borderRadius: layout.borderRadius.sm,
    padding: layout.spacing.sm,
    fontSize: typography.sizes.body
  },
  textArea: {
    minHeight: 64,
    textAlignVertical: "top"
  },
  primaryButton: {
    minHeight: layout.minTouchTarget,
    borderRadius: layout.borderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: layout.spacing.md,
    marginVertical: layout.spacing.xs
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: typography.sizes.body,
    fontWeight: "700"
  },
  replyCard: {
    borderRadius: layout.borderRadius.sm,
    borderWidth: 1,
    padding: layout.spacing.md,
    gap: layout.spacing.xs,
    marginTop: layout.spacing.xs
  },
  replyText: {
    fontSize: typography.sizes.body,
    lineHeight: 22,
    fontStyle: "italic"
  },
  replySource: {
    fontSize: typography.sizes.caption,
    fontWeight: "600"
  },
  sourceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 6
  },
  tokenBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: layout.borderRadius.full,
    borderWidth: 1
  },
  tokenBadgeText: {
    fontSize: typography.sizes.caption,
    fontWeight: "600"
  },

  saveButton: {
    minHeight: layout.minTouchTarget,
    borderRadius: layout.borderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginTop: layout.spacing.xs
  },
  saveButtonText: {
    fontSize: typography.sizes.body,
    fontWeight: "700"
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  pill: {
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: 4,
    borderRadius: layout.borderRadius.full,
    borderWidth: 1
  },
  pillText: {
    fontSize: typography.sizes.caption,
    fontWeight: "600"
  },
  lampItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: layout.spacing.sm,
    paddingVertical: layout.spacing.xs,
    borderBottomWidth: 0.5
  },
  lampIcon: {
    fontSize: 18
  },
  lampWishText: {
    flex: 1,
    fontSize: typography.sizes.body
  },
  safetyText: {
    fontSize: typography.sizes.caption,
    textAlign: "center",
    fontStyle: "italic",
    paddingVertical: layout.spacing.sm
  }
});
