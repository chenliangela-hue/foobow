import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { layout, typography } from "../../theme/theme";
import { useThemeColors } from "../../theme/ThemeContext";

type CommunityViewProps = {
  blessingInput: string;
  onChangeBlessingInput: (text: string) => void;
  blessings: string[];
  onSendBlessing: () => void;
  seniorMode?: boolean;
};

export function CommunityView({
  blessingInput,
  onChangeBlessingInput,
  blessings,
  onSendBlessing,
  seniorMode
}: CommunityViewProps) {
  const currentColors = useThemeColors();

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.eyebrow,
          { color: currentColors.muted },
          seniorMode && { fontSize: typography.sizes.caption }
        ]}
      >
        Community
      </Text>
      <Text
        style={[
          styles.title,
          { color: currentColors.ink },
          seniorMode && { fontSize: typography.sizes.headerSenior }
        ]}
      >
        A low-pressure kindness wall.
      </Text>
      <TextInput
        multiline
        value={blessingInput}
        onChangeText={onChangeBlessingInput}
        placeholder="May your road feel less heavy today."
        placeholderTextColor={currentColors.muted}
        style={[styles.input, { color: currentColors.ink, borderColor: currentColors.line }]}
      />
      <Pressable
        style={[styles.primaryButton, { backgroundColor: currentColors.jade }]}
        onPress={onSendBlessing}
      >
        <Text style={[styles.primaryButtonText, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
          Send blessing
        </Text>
      </Pressable>

      {blessings.map((blessing, index) => (
        <View
          key={`${blessing}-${index}`}
          style={[styles.blessingCard, { backgroundColor: currentColors.surface, borderColor: currentColors.line }]}
        >
          <Text
            style={[
              styles.body,
              { color: currentColors.muted },
              seniorMode && { fontSize: typography.sizes.bodySenior }
            ]}
          >
            {blessing}
          </Text>
          <View style={styles.inlineActions}>
            <Text style={[styles.linkText, { color: currentColors.jade }]}>Bless</Text>
            <Text style={[styles.linkText, { color: currentColors.muted }]}>Report</Text>
          </View>
        </View>
      ))}
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
    fontSize: typography.sizes.body,
    lineHeight: 22
  },
  input: {
    minHeight: 80,
    padding: layout.spacing.sm,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    fontSize: typography.sizes.body,
    textAlignVertical: "top"
  },
  primaryButton: {
    minHeight: layout.minTouchTarget,
    paddingHorizontal: layout.spacing.lg,
    paddingVertical: layout.spacing.sm,
    borderRadius: layout.borderRadius.full,
    alignItems: "center",
    justifyContent: "center"
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: typography.sizes.body,
    fontWeight: "700"
  },
  blessingCard: {
    padding: layout.spacing.md,
    borderRadius: layout.borderRadius.lg,
    borderWidth: 1,
    gap: layout.spacing.xs
  },
  inlineActions: {
    flexDirection: "row",
    gap: layout.spacing.md,
    marginTop: layout.spacing.xs
  },
  linkText: {
    fontSize: typography.sizes.caption,
    fontWeight: "600"
  }
});
