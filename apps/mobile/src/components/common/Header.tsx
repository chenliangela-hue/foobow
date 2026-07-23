import { StyleSheet, Text, View } from "react-native";
import { layout, typography } from "../../theme/theme";
import { useThemeColors } from "../../theme/ThemeContext";

type HeaderProps = {
  karma: number;
  seniorMode?: boolean;
};

export function Header({ karma, seniorMode }: HeaderProps) {
  const currentColors = useThemeColors();

  return (
    <View style={[styles.header, { borderBottomColor: currentColors.line }]}>
      <View>
        <Text
          style={[
            styles.eyebrow,
            { color: currentColors.muted },
            seniorMode && { fontSize: typography.sizes.caption }
          ]}
        >
          Virtual good karma map
        </Text>
        <Text
          style={[
            styles.logo,
            { color: currentColors.ink },
            seniorMode && { fontSize: typography.sizes.headerSenior }
          ]}
        >
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
    textTransform: "uppercase",
    letterSpacing: 0.8
  },
  logo: {
    fontSize: typography.sizes.header,
    fontWeight: "700",
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
