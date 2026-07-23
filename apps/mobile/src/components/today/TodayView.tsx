import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { layout, typography } from "../../theme/theme";
import { useThemeColors } from "../../theme/ThemeContext";
import { MoodOption } from "../../types";

type TodayViewProps = {
  selectedMood: MoodOption;
  onSelectMood: (mood: MoodOption) => void;
  streak: number;
  journal: string;
  onChangeJournal: (text: string) => void;
  onCompleteDaily: () => void;
  seniorMode?: boolean;
  moods: MoodOption[];
};

export function TodayView({
  selectedMood,
  onSelectMood,
  streak,
  journal,
  onChangeJournal,
  onCompleteDaily,
  seniorMode,
  moods
}: TodayViewProps) {
  const currentColors = useThemeColors();
  const eyebrowColor = { color: currentColors.muted };
  const headingColor = { color: currentColors.ink };
  const bodyColor = { color: currentColors.muted };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={[styles.eyebrow, eyebrowColor, seniorMode && { fontSize: typography.sizes.caption }]}>
          Today
        </Text>
        <Text style={[styles.title, headingColor, seniorMode && { fontSize: typography.sizes.headerSenior }]}>
          Do one quiet good deed.
        </Text>
        <Text style={[styles.body, bodyColor, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
          Check in, choose a small symbolic action, and leave the day a little lighter.
        </Text>
      </View>

      <View style={[styles.panel, { backgroundColor: currentColors.surface, borderColor: currentColors.line }]}>
        <View style={styles.rowBetween}>
          <Text style={[styles.sectionTitle, headingColor, seniorMode && { fontSize: typography.sizes.titleSenior }]}>
            How are you arriving?
          </Text>
          <View style={[styles.pill, { backgroundColor: currentColors.goldGlow }]}>
            <Text style={[styles.pillText, { color: currentColors.gold }]}>{streak} day streak</Text>
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
                  {mood.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={[styles.focusCard, { backgroundColor: currentColors.surface, borderColor: currentColors.gold }]}>
        <Text style={[styles.eyebrow, eyebrowColor, seniorMode && { fontSize: typography.sizes.caption }]}>
          Recommended deed
        </Text>
        <Text style={[styles.sectionTitle, headingColor, seniorMode && { fontSize: typography.sizes.titleSenior }]}>
          {selectedMood.deed}
        </Text>
        <Text style={[styles.body, bodyColor, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
          A symbolic action that keeps comfort separate from real-world claims.
        </Text>
        <Pressable
          style={[styles.primaryButton, { backgroundColor: currentColors.jade }]}
          onPress={onCompleteDaily}
        >
          <Text style={[styles.primaryButtonText, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
            Complete deed
          </Text>
        </Pressable>
      </View>

      <View style={[styles.panel, { backgroundColor: currentColors.surface, borderColor: currentColors.line }]}>
        <Text style={[styles.sectionTitle, headingColor, seniorMode && { fontSize: typography.sizes.titleSenior }]}>
          Karma journal
        </Text>
        <TextInput
          multiline
          value={journal}
          onChangeText={onChangeJournal}
          placeholder="Today I want to release one worry and do one kind thing."
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
  }
});
