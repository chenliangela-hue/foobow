import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, layout, typography } from "../../theme/theme";
import { CategoryFilters } from "../common/CategoryFilters";
import { CategoryId, MapSpot } from "../../types";

type MapViewProps = {
  activeCategory: CategoryId;
  onSelectCategory: (categoryId: CategoryId) => void;
  selectedSpot: MapSpot;
  onSelectSpot: (spotId: string) => void;
  visibleSpots: MapSpot[];
  seniorMode?: boolean;
};

export function MapView({
  activeCategory,
  onSelectCategory,
  selectedSpot,
  onSelectSpot,
  visibleSpots,
  seniorMode
}: MapViewProps) {
  const currentColors = colors.light;

  return (
    <View style={styles.container}>
      <View style={[styles.mapStage, { backgroundColor: currentColors.surface, borderColor: currentColors.line }]}>
        <Text style={[styles.eyebrow, seniorMode && { fontSize: typography.sizes.caption }]}>World map</Text>
        <Text style={[styles.title, seniorMode && { fontSize: typography.sizes.headerSenior }]}>
          Explore places that need a little light.
        </Text>
        {visibleSpots.map((spot) => {
          const isSelected = selectedSpot.id === spot.id;
          return (
            <Pressable
              key={spot.id}
              accessibilityLabel={`${spot.name} good deed spot`}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => onSelectSpot(spot.id)}
              style={[
                styles.mapPin,
                {
                  left: spot.x,
                  top: spot.y,
                  backgroundColor: isSelected ? currentColors.gold : currentColors.jade,
                  borderColor: currentColors.surfaceStrong
                },
                isSelected && styles.mapPinActive
              ]}
            />
          );
        })}
      </View>

      <CategoryFilters
        activeCategory={activeCategory}
        onSelect={onSelectCategory}
        seniorMode={seniorMode}
      />

      <View style={[styles.panel, { backgroundColor: currentColors.surface, borderColor: currentColors.line }]}>
        <Text style={[styles.eyebrow, seniorMode && { fontSize: typography.sizes.caption }]}>
          {selectedSpot.categoryLabel}
        </Text>
        <Text style={[styles.sectionTitle, seniorMode && { fontSize: typography.sizes.titleSenior }]}>
          {selectedSpot.name}
        </Text>
        <Text style={[styles.body, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
          {selectedSpot.description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: layout.spacing.sm
  },
  mapStage: {
    height: 240,
    padding: layout.spacing.md,
    borderRadius: layout.borderRadius.lg,
    borderWidth: 1,
    position: "relative",
    overflow: "hidden"
  },
  eyebrow: {
    fontSize: typography.sizes.eyebrow,
    color: colors.light.muted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: layout.spacing.xs
  },
  title: {
    fontSize: typography.sizes.title,
    fontWeight: "700",
    color: colors.light.ink,
    fontFamily: typography.fontFamilySerif,
    maxWidth: "80%"
  },
  mapPin: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: layout.borderRadius.full,
    borderWidth: 2,
    transform: [{ translateX: -12 }, { translateY: -12 }]
  },
  mapPinActive: {
    width: 32,
    height: 32,
    transform: [{ translateX: -16 }, { translateY: -16 }]
  },
  panel: {
    padding: layout.spacing.md,
    borderRadius: layout.borderRadius.lg,
    borderWidth: 1,
    gap: layout.spacing.xs
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
  }
});
