import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, layout, typography } from "../../theme/theme";
import { CategoryId } from "../../types";
import { categories } from "../../services/foobowService";

type CategoryFiltersProps = {
  activeCategory: CategoryId;
  onSelect: (categoryId: CategoryId) => void;
  seniorMode?: boolean;
};

export function CategoryFilters({ activeCategory, onSelect, seniorMode }: CategoryFiltersProps) {
  const currentColors = colors.light;

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
              {cat.label}
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
