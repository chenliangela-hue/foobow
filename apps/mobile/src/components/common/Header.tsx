import { StyleSheet, Text, View } from "react-native";
import { colors, layout, typography } from "../../theme/theme";

type HeaderProps = {
  karma: number;
  seniorMode?: boolean;
};

export function Header({ karma, seniorMode }: HeaderProps) {
  const currentColors = colors.light;

  return (
    <View style={[styles.header, { borderBottomColor: currentColors.line }]}>
      <View>
        <Text style={[styles.eyebrow, seniorMode && { fontSize: typography.sizes.caption }]}>
          Virtual good karma map
        </Text>
        <Text style={[styles.logo, seniorMode && { fontSize: typography.sizes.headerSenior }]}>
          Foobow 浮宝
        </Text>
      </View>
      <View style={[styles.karmaRing, { backgroundColor: currentColors.surface, borderColor: currentColors.gold }]}>
        <Text style={[styles.karmaValue, { color: currentColors.gold }]}>{karma}</Text>
        <Text style={[styles.karmaLabel, { color: currentColors.muted }]}>karma</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.sm,
    borderBottomWidth: 1
  },
  eyebrow: {
    fontSize: typography.sizes.eyebrow,
    color: colors.light.muted,
    textTransform: "uppercase",
    letterSpacing: 0.8
  },
  logo: {
    fontSize: typography.sizes.header,
    fontWeight: "700",
    color: colors.light.ink,
    fontFamily: typography.fontFamilySerif
  },
  karmaRing: {
    minWidth: 54,
    height: 54,
    borderRadius: layout.borderRadius.full,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8
  },
  karmaValue: {
    fontSize: 18,
    fontWeight: "700"
  },
  karmaLabel: {
    fontSize: 10,
    textTransform: "uppercase"
  }
});
