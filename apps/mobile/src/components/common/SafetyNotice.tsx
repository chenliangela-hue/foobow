import { StyleSheet, Text, View } from "react-native";
import { colors, layout, typography } from "../../theme/theme";

type SafetyNoticeProps = {
  seniorMode?: boolean;
};

export function SafetyNotice({ seniorMode }: SafetyNoticeProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, seniorMode && { fontSize: typography.sizes.body }]}>
        This is symbolic comfort only. It does not guarantee luck, virtue, health, or real-world impact.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: layout.spacing.sm,
    backgroundColor: "rgba(184, 137, 40, 0.08)",
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    borderColor: "rgba(184, 137, 40, 0.2)",
    marginVertical: layout.spacing.sm
  },
  text: {
    fontSize: 12,
    color: colors.light.muted,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 16
  }
});
