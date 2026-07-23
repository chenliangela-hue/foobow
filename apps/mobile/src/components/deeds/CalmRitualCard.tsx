import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, layout, typography } from "../../theme/theme";
import { SafetyNotice } from "../common/SafetyNotice";

type CalmRitualCardProps = {
  soundscape: string;
  onSelectSoundscape: (item: string) => void;
  focusReady: boolean;
  onStartFocus: () => void;
  onCompleteFocused: () => void;
  seniorMode?: boolean;
};

export function CalmRitualCard({
  soundscape,
  onSelectSoundscape,
  focusReady,
  onStartFocus,
  onCompleteFocused,
  seniorMode
}: CalmRitualCardProps) {
  const currentColors = colors.light;

  return (
    <View style={[styles.calmCard, { backgroundColor: currentColors.surface, borderColor: currentColors.jade }]}>
      <View style={styles.rowBetween}>
        <View style={styles.flexOne}>
          <Text style={[styles.eyebrow, seniorMode && { fontSize: typography.sizes.caption }]}>Calm ritual</Text>
          <Text style={[styles.sectionTitle, seniorMode && { fontSize: typography.sizes.titleSenior }]}>
            Take a focused moment first.
          </Text>
        </View>
        <View style={[styles.pill, { backgroundColor: focusReady ? currentColors.goldGlow : currentColors.line }]}>
          <Text style={[styles.pillText, { color: focusReady ? currentColors.gold : currentColors.muted }]}>
            {focusReady ? "ready" : "optional"}
          </Text>
        </View>
      </View>

      <Text style={[styles.body, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
        Use a short presence timer, optional soundscape, and quiet reflection before recording a symbolic deed.
      </Text>

      <View style={styles.soundscapeRow}>
        {["Water", "Rain", "Forest"].map((item) => {
          const isSelected = soundscape === item;
          return (
            <Pressable
              key={item}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => onSelectSoundscape(item)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: isSelected ? currentColors.jade : currentColors.surfaceStrong,
                  borderColor: isSelected ? currentColors.jade : currentColors.line
                }
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: isSelected ? currentColors.surfaceStrong : currentColors.ink },
                  seniorMode && { fontSize: typography.sizes.body }
                ]}
              >
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={[styles.focusTrack, { backgroundColor: currentColors.line }]}>
        <View style={[styles.focusFill, { width: focusReady ? "100%" : "18%", backgroundColor: currentColors.jade }]} />
      </View>

      <View style={styles.guidedList}>
        <Text style={[styles.body, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
          1. Breathe once and name the intention.
        </Text>
        <Text style={[styles.body, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
          2. Hold the action gently until the timer completes.
        </Text>
        <Text style={[styles.body, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
          3. Record how you feel without pressure.
        </Text>
      </View>

      <View style={styles.calmActions}>
        <Pressable
          style={[styles.secondaryButton, { borderColor: currentColors.jade }]}
          onPress={onStartFocus}
        >
          <Text style={[styles.secondaryButtonText, { color: currentColors.jade }, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
            Start 20s focus
          </Text>
        </Pressable>
        <Pressable
          accessibilityState={{ disabled: !focusReady }}
          style={[
            styles.primaryButton,
            { backgroundColor: focusReady ? currentColors.jade : currentColors.muted }
          ]}
          onPress={onCompleteFocused}
        >
          <Text style={[styles.primaryButtonText, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
            Complete with focus
          </Text>
        </Pressable>
      </View>

      <SafetyNotice seniorMode={seniorMode} />
    </View>
  );
}

const styles = StyleSheet.create({
  calmCard: {
    padding: layout.spacing.md,
    borderRadius: layout.borderRadius.lg,
    borderWidth: 1.5,
    gap: layout.spacing.sm
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  flexOne: {
    flex: 1
  },
  eyebrow: {
    fontSize: typography.sizes.eyebrow,
    color: colors.light.muted,
    textTransform: "uppercase",
    letterSpacing: 0.8
  },
  sectionTitle: {
    fontSize: typography.sizes.title,
    fontWeight: "700",
    color: colors.light.ink,
    fontFamily: typography.fontFamilySerif
  },
  body: {
    fontSize: typography.sizes.body,
    color: colors.light.muted,
    lineHeight: 22
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
  soundscapeRow: {
    flexDirection: "row",
    gap: layout.spacing.xs
  },
  filterChip: {
    minHeight: layout.minTouchTarget,
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.xs,
    borderRadius: layout.borderRadius.full,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  filterText: {
    fontSize: typography.sizes.caption,
    fontWeight: "600"
  },
  focusTrack: {
    height: 8,
    borderRadius: layout.borderRadius.full,
    overflow: "hidden"
  },
  focusFill: {
    height: "100%",
    borderRadius: layout.borderRadius.full
  },
  guidedList: {
    gap: 4
  },
  calmActions: {
    flexDirection: "row",
    gap: layout.spacing.xs,
    marginTop: layout.spacing.xs
  },
  secondaryButton: {
    flex: 1,
    minHeight: layout.minTouchTarget,
    paddingHorizontal: layout.spacing.sm,
    borderRadius: layout.borderRadius.full,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  secondaryButtonText: {
    fontSize: typography.sizes.caption,
    fontWeight: "700"
  },
  primaryButton: {
    flex: 1,
    minHeight: layout.minTouchTarget,
    paddingHorizontal: layout.spacing.sm,
    borderRadius: layout.borderRadius.full,
    alignItems: "center",
    justifyContent: "center"
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: typography.sizes.caption,
    fontWeight: "700"
  }
});
