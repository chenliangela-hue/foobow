import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
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
  const eyebrowColor = { color: currentColors.muted };
  const headingColor = { color: currentColors.ink };
  const bodyColor = { color: currentColors.muted };
  const panelTheme = { backgroundColor: currentColors.surface, borderColor: currentColors.line };

  return (
    <View style={styles.container}>
      <Text style={[styles.eyebrow, eyebrowColor, seniorMode && { fontSize: typography.sizes.caption }]}>
        Profile & Preferences
      </Text>
      <Text style={[styles.title, headingColor, seniorMode && { fontSize: typography.sizes.headerSenior }]}>
        Your virtual footprint.
      </Text>

      <View style={[styles.panel, panelTheme]}>
        <Text style={[styles.sectionTitle, headingColor, seniorMode && { fontSize: typography.sizes.titleSenior }]}>
          Statistics
        </Text>
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: currentColors.surfaceStrong }]}>
            <Text style={[styles.statValue, { color: currentColors.gold }, seniorMode && { fontSize: 28 }]}>{karma}</Text>
            <Text style={[styles.statLabel, bodyColor, seniorMode && { fontSize: typography.sizes.caption }]}>
              Total Karma
            </Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: currentColors.surfaceStrong }]}>
            <Text style={[styles.statValue, { color: currentColors.jade }, seniorMode && { fontSize: 28 }]}>{streak}</Text>
            <Text style={[styles.statLabel, bodyColor, seniorMode && { fontSize: typography.sizes.caption }]}>
              Day Streak
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.panel, panelTheme]}>
        <Text style={[styles.sectionTitle, headingColor, seniorMode && { fontSize: typography.sizes.titleSenior }]}>
          Preferences
        </Text>

        <View style={styles.switchRow}>
          <View style={styles.flexOne}>
            <Text style={[styles.switchLabel, headingColor, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
              Quiet Mode
            </Text>
            <Text style={[styles.body, bodyColor, seniorMode && { fontSize: typography.sizes.caption }]}>
              Suppress loud notifications and sound effects.
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
              Private Journal
            </Text>
            <Text style={[styles.body, bodyColor, seniorMode && { fontSize: typography.sizes.caption }]}>
              Keep reflections stored locally on your device.
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
              Senior / High Readability Mode
            </Text>
            <Text style={[styles.body, bodyColor, seniorMode && { fontSize: typography.sizes.caption }]}>
              Enlarge text font sizes and touch targets for comfortable reading.
            </Text>
          </View>
          <Switch
            value={seniorMode}
            onValueChange={onToggleSeniorMode}
            trackColor={{ false: currentColors.line, true: currentColors.jade }}
          />
        </View>
      </View>

      <View style={[styles.panel, panelTheme]}>
        <Text style={[styles.sectionTitle, headingColor, seniorMode && { fontSize: typography.sizes.titleSenior }]}>
          Data Controls
        </Text>
        <Pressable style={[styles.secondaryButton, { borderColor: currentColors.line }]}>
          <Text
            style={[
              styles.secondaryButtonText,
              headingColor,
              seniorMode && { fontSize: typography.sizes.bodySenior }
            ]}
          >
            Export local backup
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
