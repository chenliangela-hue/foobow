import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { useI18n } from "../../i18n/LocaleContext";
import { layout, typography } from "../../theme/theme";
import { useThemeColors } from "../../theme/ThemeContext";
import { CategoryFilters } from "../common/CategoryFilters";
import { CategoryId, MapSpot } from "../../types";

type MapViewProps = {
  activeCategory: CategoryId;
  onSelectCategory: (categoryId: CategoryId) => void;
  selectedSpot: MapSpot;
  onSelectSpot: (spotId: string) => void;
  visibleSpots: MapSpot[];
  onGoToDeeds?: () => void;
  seniorMode?: boolean;
};

export function MapView({
  activeCategory,
  onSelectCategory,
  selectedSpot,
  onSelectSpot,
  visibleSpots,
  onGoToDeeds,
  seniorMode
}: MapViewProps) {
  const currentColors = useThemeColors();
  const { t } = useI18n();
  const eyebrowColor = { color: currentColors.muted };
  const headingColor = { color: currentColors.ink };

  const [dedicatedMap, setDedicatedMap] = useState<Record<string, number>>({});
  const [justDedicated, setJustDedicated] = useState(false);

  // Gentle pulsing aura animation for the active sanctuary pin
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.65)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseScale, {
            toValue: 1.8,
            duration: 1800,
            useNativeDriver: true
          }),
          Animated.timing(pulseScale, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true
          })
        ]),
        Animated.sequence([
          Animated.timing(pulseOpacity, {
            toValue: 0,
            duration: 1800,
            useNativeDriver: true
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.65,
            duration: 0,
            useNativeDriver: true
          })
        ])
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseScale, pulseOpacity]);

  const handleDedicateRipple = (spotId: string) => {
    setDedicatedMap((prev) => ({
      ...prev,
      [spotId]: (prev[spotId] || 0) + 1
    }));
    setJustDedicated(true);
    setTimeout(() => setJustDedicated(false), 2400);
  };

  const extraRipples = dedicatedMap[selectedSpot.id] || 0;
  const totalRipples = (selectedSpot.ripples || 1280) + extraRipples;

  return (
    <View style={styles.container}>
      <View style={[styles.mapStage, { backgroundColor: currentColors.surface, borderColor: currentColors.line }]}>
        <Text style={[styles.eyebrow, eyebrowColor, seniorMode && { fontSize: typography.sizes.caption }]}>
          {t("map.eyebrow")}
        </Text>
        <Text style={[styles.title, headingColor, seniorMode && { fontSize: typography.sizes.headerSenior }]}>
          {t("map.title")}
        </Text>
        {visibleSpots.map((spot) => {
          const isSelected = selectedSpot.id === spot.id;
          return (
            <View
              key={spot.id}
              style={[styles.pinAnchor, { left: spot.x, top: spot.y }]}
            >
              {isSelected && (
                <Animated.View
                  style={[
                    styles.rippleAura,
                    {
                      borderColor: currentColors.gold,
                      backgroundColor: currentColors.goldGlow,
                      transform: [{ scale: pulseScale }],
                      opacity: pulseOpacity
                    }
                  ]}
                />
              )}
              <Pressable
                accessibilityLabel={t("map.spotLabel", { name: spot.name })}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => onSelectSpot(spot.id)}
                style={[
                  styles.mapPin,
                  {
                    backgroundColor: isSelected ? currentColors.gold : currentColors.jade,
                    borderColor: currentColors.surfaceStrong
                  },
                  isSelected && styles.mapPinActive
                ]}
              />
            </View>
          );
        })}
      </View>

      <CategoryFilters
        activeCategory={activeCategory}
        onSelect={onSelectCategory}
        seniorMode={seniorMode}
      />

      <View style={[styles.panel, { backgroundColor: currentColors.surface, borderColor: currentColors.gold }]}>
        <View style={styles.rowBetween}>
          <Text style={[styles.eyebrow, eyebrowColor, seniorMode && { fontSize: typography.sizes.caption }]}>
            {selectedSpot.categoryLabel}
          </Text>
          <View style={[styles.pill, { backgroundColor: currentColors.goldGlow }]}>
            <Text style={[styles.pillText, { color: currentColors.gold }]}>
              {totalRipples.toLocaleString()} ripples
            </Text>
          </View>
        </View>

        {selectedSpot.sanctuary && (
          <Text style={[styles.sanctuaryTitle, { color: currentColors.gold }, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
            🪷 {selectedSpot.sanctuary}
          </Text>
        )}

        <Text style={[styles.sectionTitle, headingColor, seniorMode && { fontSize: typography.sizes.titleSenior }]}>
          {selectedSpot.name}
        </Text>

        {selectedSpot.coordinates && (
          <View style={styles.coordRow}>
            <Text style={[styles.coordBadge, eyebrowColor, seniorMode && { fontSize: typography.sizes.caption }]}>
              📍 {selectedSpot.coordinates}
            </Text>
          </View>
        )}

        <Text style={[styles.body, eyebrowColor, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
          {selectedSpot.description}
        </Text>

        {selectedSpot.environment && (
          <Text style={[styles.envNote, eyebrowColor, seniorMode && { fontSize: typography.sizes.caption }]}>
            🌱 {selectedSpot.environment}
          </Text>
        )}

        {/* Dedicate Ripple Action */}
        <View style={styles.actionRow}>
          <Pressable
            accessibilityRole="button"
            onPress={() => handleDedicateRipple(selectedSpot.id)}
            style={[
              styles.dedicateBtn,
              {
                backgroundColor: justDedicated ? currentColors.goldGlow : currentColors.surfaceStrong,
                borderColor: currentColors.gold
              }
            ]}
          >
            <Text style={[styles.dedicateBtnText, { color: currentColors.gold }, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
              {justDedicated ? "✨ Ripple Dedicated · 功德圆满" : "🪷 Dedicate Ripple Here (+1)"}
            </Text>
          </Pressable>

          {onGoToDeeds && (
            <Pressable
              accessibilityRole="button"
              onPress={onGoToDeeds}
              style={[styles.actionBtn, { borderColor: currentColors.jade }]}
            >
              <Text style={[styles.actionBtnText, { color: currentColors.jade }, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
                {t("deeds.performRitual")} →
              </Text>
            </Pressable>
          )}
        </View>

        <Text style={[styles.osmAttribution, eyebrowColor]}>
          OpenStreetMap-derived coordinates · Zero-carbon mindful cartography
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
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: layout.spacing.xs
  },
  title: {
    fontSize: typography.sizes.title,
    fontWeight: "700",
    fontFamily: typography.fontFamilySerif,
    maxWidth: "80%"
  },
  pinAnchor: {
    position: "absolute",
    width: 0,
    height: 0,
    alignItems: "center",
    justifyContent: "center"
  },
  rippleAura: {
    position: "absolute",
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5
  },
  mapPin: {
    width: 24,
    height: 24,
    borderRadius: layout.borderRadius.full,
    borderWidth: 2
  },
  mapPinActive: {
    width: 32,
    height: 32
  },
  panel: {
    padding: layout.spacing.md,
    borderRadius: layout.borderRadius.lg,
    borderWidth: 1,
    gap: layout.spacing.xs
  },
  sanctuaryTitle: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.4
  },
  sectionTitle: {
    fontSize: typography.sizes.title,
    fontWeight: "700",
    fontFamily: typography.fontFamilySerif
  },
  coordRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  coordBadge: {
    fontSize: 12,
    fontFamily: "monospace",
    letterSpacing: 0.4
  },
  body: {
    fontSize: typography.sizes.body,
    lineHeight: 22
  },
  envNote: {
    fontSize: 12,
    fontStyle: "italic",
    lineHeight: 18,
    marginTop: 2
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
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
  actionRow: {
    gap: layout.spacing.xs,
    marginTop: layout.spacing.xs
  },
  dedicateBtn: {
    minHeight: layout.minTouchTarget,
    borderWidth: 1.5,
    borderRadius: layout.borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: layout.spacing.md
  },
  dedicateBtnText: {
    fontSize: typography.sizes.body,
    fontWeight: "700"
  },
  actionBtn: {
    minHeight: layout.minTouchTarget,
    borderWidth: 1.5,
    borderRadius: layout.borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: layout.spacing.md
  },
  actionBtnText: {
    fontSize: typography.sizes.body,
    fontWeight: "700"
  },
  osmAttribution: {
    fontSize: 11,
    textAlign: "center",
    marginTop: layout.spacing.xs,
    opacity: 0.75
  }
});
