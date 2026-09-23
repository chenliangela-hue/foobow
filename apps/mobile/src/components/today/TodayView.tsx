import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { dailyThoughtFor } from "../../i18n/dailyThoughts";
import { useI18n } from "../../i18n/LocaleContext";
import { layout, typography } from "../../theme/theme";
import { useThemeColors } from "../../theme/ThemeContext";
import { MoodOption } from "../../types";
import { ZenWoodenFish } from "../common/ZenWoodenFish";

type TodayViewProps = {
  selectedMood: MoodOption;
  onSelectMood: (mood: MoodOption) => void;
  streak: number;
  journal: string;
  onChangeJournal: (text: string) => void;
  onCompleteDaily: () => void;
  onTapKarma?: (points: number) => void;
  seniorMode?: boolean;
  moods: MoodOption[];
  onGoToMap?: () => void;
  onGoToBlessings?: (ritualKey?: string) => void;
};

export function TodayView({
  selectedMood,
  onSelectMood,
  streak,
  journal,
  onChangeJournal,
  onCompleteDaily,
  onTapKarma,
  seniorMode,
  moods,
  onGoToMap,
  onGoToBlessings
}: TodayViewProps) {
  const currentColors = useThemeColors();
  const { t, locale } = useI18n();
  const eyebrowColor = { color: currentColors.muted };
  const headingColor = { color: currentColors.ink };
  const bodyColor = { color: currentColors.muted };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.heroRow}>
          <Text style={[styles.eyebrow, eyebrowColor, seniorMode && { fontSize: typography.sizes.caption }]}>
            {t("today.eyebrow")}
          </Text>
          <View style={[styles.karmaDeltaPill, { backgroundColor: currentColors.goldGlow, borderColor: currentColors.gold }]}>
            <Text style={[styles.karmaDeltaText, { color: currentColors.gold }]}>
              {t("today.karmaDelta")}
            </Text>
          </View>
        </View>
        <Text style={[styles.title, headingColor, seniorMode && { fontSize: typography.sizes.headerSenior }]}>
          {t("today.title")}
        </Text>
        <Text style={[styles.body, bodyColor, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
          {t("today.copy")}
        </Text>
        <Text
          style={[
            styles.zenQuote,
            { color: currentColors.gold, borderLeftColor: currentColors.gold },
            seniorMode && { fontSize: typography.sizes.bodySenior }
          ]}
        >
          "{t("today.zenQuote")}"
        </Text>
        <Text
          style={[
            styles.dailyThought,
            { color: currentColors.muted, borderLeftColor: currentColors.jade },
            seniorMode && { fontSize: typography.sizes.bodySenior }
          ]}
        >
          {dailyThoughtFor(locale)}
        </Text>

        {/* 7-Day Flame Streak Track */}
        <View style={[styles.streakTrack, { backgroundColor: currentColors.surfaceStrong, borderColor: currentColors.line }]}>
          {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => {
            const isPastOrToday = idx < Math.min(7, Math.max(1, streak % 8));
            return (
              <View
                key={idx}
                style={[
                  styles.streakDayItem,
                  { borderColor: currentColors.line },
                  isPastOrToday && { backgroundColor: currentColors.goldGlow, borderColor: currentColors.gold }
                ]}
              >
                <Text style={styles.streakDayIcon}>{isPastOrToday ? "🔥" : "·"}</Text>
                <Text style={[styles.streakDayLabel, { color: isPastOrToday ? currentColors.gold : currentColors.muted }]}>
                  {day}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Quick Rituals Shortcut Bar */}
      <View style={[styles.panel, { backgroundColor: currentColors.surface, borderColor: currentColors.line }]}>
        <View style={styles.rowBetween}>
          <Text style={[styles.sectionTitle, headingColor, seniorMode && { fontSize: typography.sizes.titleSenior }]}>
            {t("today.quickRitualsTitle")}
          </Text>
          <Pressable onPress={() => onGoToBlessings && onGoToBlessings()}>
            <Text style={[{ color: currentColors.jade, fontSize: 13, fontWeight: "600" }]}>
              {t("categories.all")} →
            </Text>
          </Pressable>
        </View>
        <View style={styles.quickRitualsGrid}>
          {[
            { id: "lamp", icon: "🪔", title: "Wish Lamp", dur: "3 min" },
            { id: "incense", icon: "🕯️", title: "Incense", dur: "5 min" },
            { id: "muyu", icon: "🪵", title: "Wooden Fish", dur: "5 min" },
            { id: "wheel", icon: "☸️", title: "Prayer Wheel", dur: "7 min" }
          ].map((r) => (
            <Pressable
              key={r.id}
              accessibilityRole="button"
              onPress={() => onGoToBlessings && onGoToBlessings(r.id)}
              style={[styles.quickRitualCard, { backgroundColor: currentColors.surfaceStrong, borderColor: currentColors.line }]}
            >
              <Text style={styles.quickRitualIcon}>{r.icon}</Text>
              <Text style={[styles.quickRitualName, headingColor]}>{r.title}</Text>
              <Text style={[styles.quickRitualDuration, { color: currentColors.muted }]}>{r.dur}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Mini World Showcase Card */}
      <View style={[styles.panel, styles.miniWorldCard, { backgroundColor: currentColors.surface, borderColor: currentColors.line }]}>
        <View style={styles.miniWorldHeader}>
          <Text style={styles.miniWorldIcon}>🌐</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.sectionTitle, headingColor, seniorMode && { fontSize: typography.sizes.titleSenior }]}>
              {t("today.miniWorldTitle")}
            </Text>
            <Text style={[styles.body, bodyColor, { fontSize: 13 }]}>
              128,921 deeds today · 2.4M people spreading kindness
            </Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={onGoToMap}
          style={[styles.secondaryButton, { borderColor: currentColors.jade }]}
        >
          <Text style={[styles.secondaryButtonText, { color: currentColors.jade }]}>
            {t("today.exploreSanctuary")}
          </Text>
        </Pressable>
      </View>

      {/* Daily Zen Almanac (今日黄历 · 禅意日课) */}
      <View style={[styles.panel, styles.almanacPanel, { backgroundColor: currentColors.surface, borderColor: currentColors.gold }]}>
        <View style={styles.rowBetween}>
          <Text style={[styles.eyebrow, { color: currentColors.gold }, seniorMode && { fontSize: typography.sizes.caption }]}>
            {t("almanac.eyebrow", { defaultValue: "Daily Zen Almanac · 今日黄历" })}
          </Text>
          <View style={[styles.pill, { backgroundColor: currentColors.goldGlow }]}>
            <Text style={[styles.pillText, { color: currentColors.gold }]}>
              {t("almanac.date", { defaultValue: "Mindful Day" })}
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, headingColor, seniorMode && { fontSize: typography.sizes.titleSenior }]}>
          {t("almanac.title", { defaultValue: "Auspicious deeds for mindful living" })}
        </Text>

        <View style={styles.almanacGrid}>
          <View style={[styles.almanacCol, { backgroundColor: currentColors.surfaceStrong, borderColor: currentColors.line }]}>
            <View style={[styles.almanacBadge, { backgroundColor: currentColors.gold }]}>
              <Text style={styles.almanacBadgeText}>宜</Text>
            </View>
            <View style={styles.almanacItems}>
              <Text style={[styles.almanacTag, headingColor, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
                {t("almanac.suitable1", { defaultValue: "慈心放生 · Release fish" })}
              </Text>
              <Text style={[styles.almanacTagSub, eyebrowColor, seniorMode && { fontSize: typography.sizes.caption }]}>
                {t("almanac.suitable2", { defaultValue: "燃香静坐 · Kindle incense" })}
              </Text>
            </View>
          </View>

          <View style={[styles.almanacCol, { backgroundColor: currentColors.surfaceStrong, borderColor: currentColors.line }]}>
            <View style={[styles.almanacBadge, { backgroundColor: currentColors.coral }]}>
              <Text style={styles.almanacBadgeText}>忌</Text>
            </View>
            <View style={styles.almanacItems}>
              <Text style={[styles.almanacTag, headingColor, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
                {t("almanac.avoid1", { defaultValue: "浮躁争执 · Impatience" })}
              </Text>
              <Text style={[styles.almanacTagSub, eyebrowColor, seniorMode && { fontSize: typography.sizes.caption }]}>
                {t("almanac.avoid2", { defaultValue: "妄念挂碍 · Attachment" })}
              </Text>
            </View>
          </View>
        </View>

        <Text style={[styles.almanacVerse, { color: currentColors.gold }, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
          {t("almanac.verse", { defaultValue: "善念一动，天地皆宽。Every mindful deed brings boundless calm." })}
        </Text>
      </View>

      <View style={[styles.panel, { backgroundColor: currentColors.surface, borderColor: currentColors.line }]}>
        <View style={styles.rowBetween}>
          <Text style={[styles.sectionTitle, headingColor, seniorMode && { fontSize: typography.sizes.titleSenior }]}>
            {t("today.moodTitle")}
          </Text>
          <View style={[styles.pill, { backgroundColor: currentColors.goldGlow }]}>
            <Text style={[styles.pillText, { color: currentColors.gold }]}>
              {t("today.streak", { count: streak })}
            </Text>
          </View>
        </View>
        <View style={styles.grid}>
          {moods.map((mood) => {
            const isSelected = selectedMood.id === mood.id;
            return (
              <Pressable
                key={mood.id}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => onSelectMood(mood)}
                style={[
                  styles.choice,
                  {
                    backgroundColor: isSelected ? currentColors.jade : currentColors.surfaceStrong,
                    borderColor: isSelected ? currentColors.jade : currentColors.line
                  }
                ]}
              >
                <Text
                  style={[
                    styles.choiceText,
                    { color: isSelected ? currentColors.surfaceStrong : currentColors.ink },
                    seniorMode && { fontSize: typography.sizes.bodySenior }
                  ]}
                >
                  {t(`moods.${mood.id}`, { defaultValue: mood.label })}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={[styles.focusCard, { backgroundColor: currentColors.surface, borderColor: currentColors.gold }]}>
        <Text style={[styles.eyebrow, eyebrowColor, seniorMode && { fontSize: typography.sizes.caption }]}>
          {t("today.recommended")}
        </Text>
        <Text style={[styles.sectionTitle, headingColor, seniorMode && { fontSize: typography.sizes.titleSenior }]}>
          {t(`moodDeeds.${selectedMood.id}`, { defaultValue: selectedMood.deed })}
        </Text>
        <Text style={[styles.body, bodyColor, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
          {t("today.recommendedCopy")}
        </Text>
        <Pressable
          style={[styles.primaryButton, { backgroundColor: currentColors.jade }]}
          onPress={onCompleteDaily}
        >
          <Text style={[styles.primaryButtonText, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
            {t("today.completeDeed")}
          </Text>
        </Pressable>
      </View>

      <ZenWoodenFish onTapKarma={onTapKarma} seniorMode={seniorMode} />

      <View style={[styles.panel, { backgroundColor: currentColors.surface, borderColor: currentColors.line }]}>
        <Text style={[styles.sectionTitle, headingColor, seniorMode && { fontSize: typography.sizes.titleSenior }]}>
          {t("today.journalTitle")}
        </Text>
        <TextInput
          multiline
          value={journal}
          onChangeText={onChangeJournal}
          placeholder={t("today.journalPlaceholder")}
          placeholderTextColor={currentColors.muted}
          style={[styles.input, { color: currentColors.ink, borderColor: currentColors.line }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: layout.spacing.md
  },
  hero: {
    paddingVertical: layout.spacing.xs
  },
  eyebrow: {
    fontSize: typography.sizes.eyebrow,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: layout.spacing.xs
  },
  title: {
    fontSize: typography.sizes.header,
    fontWeight: "700",
    fontFamily: typography.fontFamilySerif,
    marginBottom: layout.spacing.xs
  },
  body: {
    fontSize: typography.sizes.body,
    lineHeight: 22
  },
  dailyThought: {
    fontSize: typography.sizes.body,
    fontStyle: "italic",
    lineHeight: 22,
    marginTop: layout.spacing.sm,
    paddingLeft: layout.spacing.sm,
    borderLeftWidth: 3
  },
  panel: {
    padding: layout.spacing.md,
    borderRadius: layout.borderRadius.lg,
    borderWidth: 1,
    gap: layout.spacing.sm
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  sectionTitle: {
    fontSize: typography.sizes.title,
    fontWeight: "700",
    fontFamily: typography.fontFamilySerif
  },
  pill: {
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: 4,
    borderRadius: layout.borderRadius.full
  },
  pillText: {
    fontSize: 12,
    fontWeight: "700"
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: layout.spacing.xs
  },
  choice: {
    flex: 1,
    minWidth: "45%",
    minHeight: layout.minTouchTarget,
    padding: layout.spacing.sm,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  choiceText: {
    fontSize: typography.sizes.body,
    fontWeight: "600"
  },
  focusCard: {
    padding: layout.spacing.md,
    borderRadius: layout.borderRadius.lg,
    borderWidth: 1.5,
    gap: layout.spacing.sm
  },
  primaryButton: {
    minHeight: layout.minTouchTarget,
    paddingHorizontal: layout.spacing.lg,
    paddingVertical: layout.spacing.sm,
    borderRadius: layout.borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginTop: layout.spacing.xs
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: typography.sizes.body,
    fontWeight: "700"
  },
  input: {
    minHeight: 80,
    padding: layout.spacing.sm,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    fontSize: typography.sizes.body,
    textAlignVertical: "top"
  },
  almanacPanel: {
    borderWidth: 1.5,
    borderLeftWidth: 4
  },
  almanacGrid: {
    gap: layout.spacing.xs,
    marginVertical: layout.spacing.xs
  },
  almanacCol: {
    flexDirection: "row",
    alignItems: "center",
    padding: layout.spacing.sm,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    gap: layout.spacing.sm
  },
  almanacBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center"
  },
  almanacBadgeText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 13
  },
  almanacItems: {
    flex: 1,
    gap: 2
  },
  almanacTag: {
    fontSize: typography.sizes.body,
    fontWeight: "600"
  },
  almanacTagSub: {
    fontSize: typography.sizes.caption
  },
  almanacVerse: {
    fontStyle: "italic",
    textAlign: "center",
    fontSize: typography.sizes.caption,
    marginTop: layout.spacing.xs
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: layout.spacing.xs
  },
  karmaDeltaPill: {
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: 2,
    borderRadius: layout.borderRadius.full,
    borderWidth: 1
  },
  karmaDeltaText: {
    fontSize: 12,
    fontWeight: "700"
  },
  zenQuote: {
    fontSize: typography.sizes.body,
    fontStyle: "italic",
    lineHeight: 22,
    marginTop: layout.spacing.xs,
    paddingLeft: layout.spacing.sm,
    borderLeftWidth: 3
  },
  streakTrack: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: layout.spacing.sm,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    marginTop: layout.spacing.sm
  },
  streakDayItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 44,
    borderRadius: layout.borderRadius.sm,
    borderWidth: 1
  },
  streakDayIcon: {
    fontSize: 16,
    marginBottom: 2
  },
  streakDayLabel: {
    fontSize: 11,
    fontWeight: "600"
  },
  quickRitualsGrid: {
    flexDirection: "row",
    gap: layout.spacing.xs,
    marginTop: layout.spacing.xs
  },
  quickRitualCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: layout.spacing.sm,
    paddingHorizontal: 4,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1
  },
  quickRitualIcon: {
    fontSize: 24,
    marginBottom: 4
  },
  quickRitualName: {
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center"
  },
  quickRitualDuration: {
    fontSize: 10,
    marginTop: 2
  },
  miniWorldCard: {
    gap: layout.spacing.sm
  },
  miniWorldHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: layout.spacing.sm
  },
  miniWorldIcon: {
    fontSize: 32
  },
  secondaryButton: {
    minHeight: layout.minTouchTarget,
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.xs,
    borderRadius: layout.borderRadius.full,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: layout.spacing.xs
  },
  secondaryButtonText: {
    fontSize: typography.sizes.body,
    fontWeight: "700"
  }
});
