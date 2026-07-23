import { StyleSheet, Text, View } from "react-native";
import { useI18n } from "../../i18n/LocaleContext";
import { layout, typography } from "../../theme/theme";
import { useThemeColors } from "../../theme/ThemeContext";

type SafetyNoticeProps = {
  seniorMode?: boolean;
};

export function SafetyNotice({ seniorMode }: SafetyNoticeProps) {
  const currentColors = useThemeColors();
  const { t } = useI18n();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentColors.goldGlow, borderColor: currentColors.cardBorder }
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: currentColors.muted },
          seniorMode && { fontSize: typography.sizes.body }
        ]}
      >
        {t("safety.notice")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: layout.spacing.sm,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    marginVertical: layout.spacing.sm
  },
  text: {
    fontSize: 12,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 16
  }
});
