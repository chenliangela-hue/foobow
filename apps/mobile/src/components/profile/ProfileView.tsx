import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { clerkEnabled } from "../../auth/clerkConfig";
import { LocalePreference, useI18n } from "../../i18n/LocaleContext";
import { AccountCard } from "./AccountCard";
import { layout, typography } from "../../theme/theme";
import { useThemeColors } from "../../theme/ThemeContext";

type ProfileViewProps = {
  quietMode: boolean;
  onToggleQuietMode: (value: boolean) => void;
  privateJournal: boolean;
  onTogglePrivateJournal: (value: boolean) => void;
  seniorMode: boolean;
  onToggleSeniorMode: (value: boolean) => void;
  karma: number;
  streak: number;
};

export function ProfileView({
  quietMode,
  onToggleQuietMode,
  privateJournal,
  onTogglePrivateJournal,
  seniorMode,
  onToggleSeniorMode,
  karma,
  streak
}: ProfileViewProps) {
  const currentColors = useThemeColors();
  const { t, preference, setPreference } = useI18n();
  const eyebrowColor = { color: currentColors.muted };
  const headingColor = { color: currentColors.ink };
  const bodyColor = { color: currentColors.muted };
  const panelTheme = { backgroundColor: currentColors.surface, borderColor: currentColors.line };

  const languageOptions: { value: LocalePreference; label: string }[] = [
    { value: "system", label: t("profile.languageSystem") },
    { value: "en", label: "English" },
    { value: "zh-Hans", label: "中文" }
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.eyebrow, eyebrowColor, seniorMode && { fontSize: typography.sizes.caption }]}>
        {t("profile.eyebrow")}
      </Text>
      <Text style={[styles.title, headingColor, seniorMode && { fontSize: typography.sizes.headerSenior }]}>
        {t("profile.title")}
      </Text>

      {clerkEnabled && <AccountCard seniorMode={seniorMode} />}

      <View style={[styles.panel, panelTheme]}>
        <Text style={[styles.sectionTitle, headingColor, seniorMode && { fontSize: typography.sizes.titleSenior }]}>
          {t("profile.statistics")}
        </Text>
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: currentColors.surfaceStrong }]}>
            <Text style={[styles.statValue, { color: currentColors.gold }, seniorMode && { fontSize: 28 }]}>{karma}</Text>
            <Text style={[styles.statLabel, bodyColor, seniorMode && { fontSize: typography.sizes.caption }]}>
              {t("profile.totalKarma")}
            </Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: currentColors.surfaceStrong }]}>
            <Text style={[styles.statValue, { color: currentColors.jade }, seniorMode && { fontSize: 28 }]}>{streak}</Text>
            <Text style={[styles.statLabel, bodyColor, seniorMode && { fontSize: typography.sizes.caption }]}>
              {t("profile.dayStreak")}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.panel, panelTheme]}>
        <Text style={[styles.sectionTitle, headingColor, seniorMode && { fontSize: typography.sizes.titleSenior }]}>
          {t("profile.preferences")}
        </Text>

        <View style={styles.switchRow}>
          <View style={styles.flexOne}>
            <Text style={[styles.switchLabel, headingColor, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
              {t("profile.quietMode")}
            </Text>
            <Text style={[styles.body, bodyColor, seniorMode && { fontSize: typography.sizes.caption }]}>
              {t("profile.quietModeCopy")}
            </Text>
          </View>
          <Switch
            value={quietMode}
            onValueChange={onToggleQuietMode}
            trackColor={{ false: currentColors.line, true: currentColors.jade }}
          />
        </View>

        <View style={styles.switchRow}>
          <View style={styles.flexOne}>
            <Text style={[styles.switchLabel, headingColor, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
              {t("profile.privateJournal")}
            </Text>
            <Text style={[styles.body, bodyColor, seniorMode && { fontSize: typography.sizes.caption }]}>
              {t("profile.privateJournalCopy")}
            </Text>
          </View>
          <Switch
            value={privateJournal}
            onValueChange={onTogglePrivateJournal}
            trackColor={{ false: currentColors.line, true: currentColors.jade }}
          />
        </View>

        <View style={styles.switchRow}>
          <View style={styles.flexOne}>
            <Text style={[styles.switchLabel, headingColor, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
              {t("profile.seniorMode")}
            </Text>
            <Text style={[styles.body, bodyColor, seniorMode && { fontSize: typography.sizes.caption }]}>
              {t("profile.seniorModeCopy")}
            </Text>
          </View>
          <Switch
            value={seniorMode}
            onValueChange={onToggleSeniorMode}
            trackColor={{ false: currentColors.line, true: currentColors.jade }}
          />
        </View>

        <View style={styles.languageBlock}>
          <Text style={[styles.switchLabel, headingColor, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
            {t("profile.language")}
          </Text>
          <Text style={[styles.body, bodyColor, seniorMode && { fontSize: typography.sizes.caption }]}>
            {t("profile.languageCopy")}
          </Text>
          <View style={styles.languageRow}>
            {languageOptions.map((option) => {
              const isActive = preference === option.value;
              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                  onPress={() => setPreference(option.value)}
                  style={[
                    styles.languageChip,
                    {
                      backgroundColor: isActive ? currentColors.jade : currentColors.surfaceStrong,
                      borderColor: isActive ? currentColors.jade : currentColors.line
                    }
                  ]}
                >
                  <Text
                    style={[
                      styles.languageChipText,
                      { color: isActive ? currentColors.surfaceStrong : currentColors.ink },
                      seniorMode && { fontSize: typography.sizes.body }
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>

      <View style={[styles.panel, panelTheme]}>
        <Text style={[styles.sectionTitle, headingColor, seniorMode && { fontSize: typography.sizes.titleSenior }]}>
          {t("profile.dataControls")}
        </Text>
        <Pressable style={[styles.secondaryButton, { borderColor: currentColors.line }]}>
          <Text
            style={[
              styles.secondaryButtonText,
              headingColor,
              seniorMode && { fontSize: typography.sizes.bodySenior }
            ]}
          >
            {t("profile.exportBackup")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: layout.spacing.sm
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
  body: {
    fontSize: typography.sizes.caption,
    lineHeight: 18
  },
  panel: {
    padding: layout.spacing.md,
    borderRadius: layout.borderRadius.lg,
    borderWidth: 1,
    gap: layout.spacing.sm
  },
  sectionTitle: {
    fontSize: typography.sizes.title,
    fontWeight: "700",
    fontFamily: typography.fontFamilySerif
  },
  statsRow: {
    flexDirection: "row",
    gap: layout.spacing.md
  },
  statBox: {
    flex: 1,
    padding: layout.spacing.sm,
    borderRadius: layout.borderRadius.md,
    alignItems: "center"
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700"
  },
  statLabel: {
    fontSize: 12,
    textTransform: "uppercase"
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: layout.spacing.xs
  },
  flexOne: {
    flex: 1,
    paddingRight: layout.spacing.sm
  },
  switchLabel: {
    fontSize: typography.sizes.body,
    fontWeight: "600"
  },
  languageBlock: {
    paddingVertical: layout.spacing.xs,
    gap: layout.spacing.xs
  },
  languageRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: layout.spacing.xs,
    marginTop: layout.spacing.xs
  },
  languageChip: {
    minHeight: layout.minTouchTarget,
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.xs,
    borderRadius: layout.borderRadius.full,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  languageChipText: {
    fontSize: typography.sizes.caption,
    fontWeight: "600"
  },
  secondaryButton: {
    minHeight: layout.minTouchTarget,
    paddingHorizontal: layout.spacing.md,
    borderRadius: layout.borderRadius.full,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  secondaryButtonText: {
    fontSize: typography.sizes.body,
    fontWeight: "600"
  }
});
