import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { useI18n } from "../../i18n/LocaleContext";
import { layout, typography } from "../../theme/theme";
import { useThemeColors } from "../../theme/ThemeContext";
import { CategoryId } from "../../types";
import { categories } from "../../services/foobowService";

type CategoryFiltersProps = {
  activeCategory: CategoryId;
  onSelect: (categoryId: CategoryId) => void;
  seniorMode?: boolean;
};

export function CategoryFilters({ activeCategory, onSelect, seniorMode }: CategoryFiltersProps) {
  const currentColors = useThemeColors();
  const { t } = useI18n();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <Pressable
            key={cat.id}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            onPress={() => onSelect(cat.id)}
            style={[
              styles.chip,
              {
                backgroundColor: isActive ? currentColors.jade : currentColors.surface,
                borderColor: isActive ? currentColors.jade : currentColors.line
              }
            ]}
          >
            <Text
              style={[
                styles.chipText,
                { color: isActive ? currentColors.surfaceStrong : currentColors.ink },
                seniorMode && { fontSize: typography.sizes.body }
              ]}
            >
              {t(`categories.${cat.id}`, { defaultValue: cat.label })}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: layout.spacing.sm
  },
  contentContainer: {
    paddingHorizontal: layout.spacing.md,
    gap: layout.spacing.xs
  },
  chip: {
    minHeight: layout.minTouchTarget,
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.xs,
    borderRadius: layout.borderRadius.full,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  chipText: {
    fontSize: typography.sizes.caption,
    fontWeight: "600"
  }
});
