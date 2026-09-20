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
  const [selectedDeed, setSelectedDeed] = useState<"fish" | "lantern" | "birds" | "tree">("fish");
  const [animatingDeed, setAnimatingDeed] = useState<string | null>(null);

  // Gentle pulsing aura animation for the active sanctuary pin
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.65)).current;

  // In-map deed execution animation references
  const animCoord = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const animOpacity = useRef(new Animated.Value(0)).current;
  const rippleExpand = useRef(new Animated.Value(0.2)).current;
  const rippleExpandOpacity = useRef(new Animated.Value(1)).current;
  const toastY = useRef(new Animated.Value(0)).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;

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

  const executeDeedOnMap = (deedKey: "fish" | "lantern" | "birds" | "tree") => {
    setAnimatingDeed(deedKey);
    setDedicatedMap((prev) => ({
      ...prev,
      [selectedSpot.id]: (prev[selectedSpot.id] || 0) + 1
    }));
    setJustDedicated(true);

    animCoord.setValue({ x: 0, y: 0 });
    animOpacity.setValue(1);
    rippleExpand.setValue(0.2);
    rippleExpandOpacity.setValue(1);
    toastY.setValue(0);
    toastOpacity.setValue(0);

    Animated.parallel([
      // Movement
      Animated.timing(animCoord, {
        toValue: { x: 50, y: -40 },
        duration: 2200,
        useNativeDriver: true
      }),
      // Fade sprite
      Animated.sequence([
        Animated.timing(animOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.delay(1400),
        Animated.timing(animOpacity, { toValue: 0, duration: 400, useNativeDriver: true })
      ]),
      // Expand water ripple ring
      Animated.timing(rippleExpand, {
        toValue: 2.8,
        duration: 1800,
        useNativeDriver: true
      }),
      Animated.timing(rippleExpandOpacity, {
        toValue: 0,
        duration: 1800,
        useNativeDriver: true
      }),
      // Merit toast rise
      Animated.sequence([
        Animated.parallel([
          Animated.timing(toastY, { toValue: -32, duration: 400, useNativeDriver: true }),
          Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true })
        ]),
        Animated.delay(1200),
        Animated.parallel([
          Animated.timing(toastY, { toValue: -60, duration: 500, useNativeDriver: true }),
          Animated.timing(toastOpacity, { toValue: 0, duration: 500, useNativeDriver: true })
        ])
      ])
    ]).start(() => {
      setAnimatingDeed(null);
      setJustDedicated(false);
    });
  };

  const handleDedicateRipple = (spotId: string) => {
    executeDeedOnMap(selectedDeed);
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

        {/* In-Map Deed Animation Layer */}
        {animatingDeed && (
          <>
            <Animated.View
              style={[
                styles.animWaterRipple,
                {
                  left: selectedSpot.x,
                  top: selectedSpot.y,
                  borderColor: currentColors.gold,
                  transform: [{ scale: rippleExpand }],
                  opacity: rippleExpandOpacity
                }
              ]}
            />
            <Animated.View
              style={[
                styles.animSprite,
                {
                  left: selectedSpot.x,
                  top: selectedSpot.y,
                  transform: animCoord.getTranslateTransform(),
                  opacity: animOpacity
                }
              ]}
            >
              <Text style={styles.animSpriteText}>
                {animatingDeed === "fish" ? "🐟" : animatingDeed === "lantern" ? "🏮" : animatingDeed === "birds" ? "🕊️" : "🌱"}
              </Text>
            </Animated.View>
            <Animated.View
              style={[
                styles.animMeritToast,
                {
                  left: selectedSpot.x,
                  top: selectedSpot.y,
                  backgroundColor: currentColors.gold,
                  transform: [{ translateY: toastY }],
                  opacity: toastOpacity
                }
              ]}
            >
              <Text style={styles.animMeritToastText}>
                {animatingDeed === "fish"
                  ? t("mapDeck.fish")
                  : animatingDeed === "lantern"
                  ? t("mapDeck.lantern")
                  : animatingDeed === "birds"
                  ? t("mapDeck.birds")
                  : t("mapDeck.tree")} · +5
              </Text>
            </Animated.View>
          </>
        )}
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

        {/* In-Map Deed Selection Deck */}
        <View style={styles.deckSection}>
          <Text style={[styles.deckSectionTitle, { color: currentColors.gold }, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
            {t("mapDeck.title")}
          </Text>
          <View style={styles.deckGrid}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setSelectedDeed("fish")}
              style={[
                styles.deckBtn,
                {
                  backgroundColor: selectedDeed === "fish" ? currentColors.goldGlow : currentColors.surfaceStrong,
                  borderColor: selectedDeed === "fish" ? currentColors.gold : currentColors.line
                }
              ]}
            >
              <Text style={styles.deckBtnIcon}>🐟</Text>
              <View style={styles.deckBtnTextCol}>
                <Text style={[styles.deckBtnTitle, headingColor, seniorMode && { fontSize: typography.sizes.bodySenior }]}>{t("mapDeck.fish")}</Text>
                <Text style={[styles.deckBtnSub, eyebrowColor, seniorMode && { fontSize: typography.sizes.caption }]}>{t("mapDeck.fishDesc")}</Text>
              </View>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => setSelectedDeed("lantern")}
              style={[
                styles.deckBtn,
                {
                  backgroundColor: selectedDeed === "lantern" ? currentColors.goldGlow : currentColors.surfaceStrong,
                  borderColor: selectedDeed === "lantern" ? currentColors.gold : currentColors.line
                }
              ]}
            >
              <Text style={styles.deckBtnIcon}>🏮</Text>
              <View style={styles.deckBtnTextCol}>
                <Text style={[styles.deckBtnTitle, headingColor, seniorMode && { fontSize: typography.sizes.bodySenior }]}>{t("mapDeck.lantern")}</Text>
                <Text style={[styles.deckBtnSub, eyebrowColor, seniorMode && { fontSize: typography.sizes.caption }]}>{t("mapDeck.lanternDesc")}</Text>
              </View>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => setSelectedDeed("birds")}
              style={[
                styles.deckBtn,
                {
                  backgroundColor: selectedDeed === "birds" ? currentColors.goldGlow : currentColors.surfaceStrong,
                  borderColor: selectedDeed === "birds" ? currentColors.gold : currentColors.line
                }
              ]}
            >
              <Text style={styles.deckBtnIcon}>🕊️</Text>
              <View style={styles.deckBtnTextCol}>
                <Text style={[styles.deckBtnTitle, headingColor, seniorMode && { fontSize: typography.sizes.bodySenior }]}>{t("mapDeck.birds")}</Text>
                <Text style={[styles.deckBtnSub, eyebrowColor, seniorMode && { fontSize: typography.sizes.caption }]}>{t("mapDeck.birdsDesc")}</Text>
              </View>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => setSelectedDeed("tree")}
              style={[
                styles.deckBtn,
                {
                  backgroundColor: selectedDeed === "tree" ? currentColors.goldGlow : currentColors.surfaceStrong,
                  borderColor: selectedDeed === "tree" ? currentColors.gold : currentColors.line
                }
              ]}
            >
              <Text style={styles.deckBtnIcon}>🌿</Text>
              <View style={styles.deckBtnTextCol}>
                <Text style={[styles.deckBtnTitle, headingColor, seniorMode && { fontSize: typography.sizes.bodySenior }]}>{t("mapDeck.tree")}</Text>
                <Text style={[styles.deckBtnSub, eyebrowColor, seniorMode && { fontSize: typography.sizes.caption }]}>{t("mapDeck.treeDesc")}</Text>
              </View>
            </Pressable>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => executeDeedOnMap(selectedDeed)}
            style={[styles.performDeedBtn, { backgroundColor: currentColors.gold }]}
          >
            <Text style={[styles.performDeedBtnText, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
              {t("mapDeck.perform")}
            </Text>
          </Pressable>
        </View>

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
  },
  animWaterRipple: {
    position: "absolute",
    width: 60,
    height: 60,
    marginLeft: -30,
    marginTop: -30,
    borderRadius: 30,
    borderWidth: 2
  },
  animSprite: {
    position: "absolute",
    width: 40,
    height: 40,
    marginLeft: -20,
    marginTop: -20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 30
  },
  animSpriteText: {
    fontSize: 28
  },
  animMeritToast: {
    position: "absolute",
    marginLeft: -60,
    marginTop: -16,
    width: 120,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: layout.borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 35
  },
  animMeritToastText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700"
  },
  deckSection: {
    marginTop: layout.spacing.xs,
    gap: layout.spacing.xs
  },
  deckSectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3
  },
  deckGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: layout.spacing.xs
  },
  deckBtn: {
    flex: 1,
    minWidth: "46%",
    flexDirection: "row",
    alignItems: "center",
    padding: layout.spacing.xs,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1.5,
    gap: layout.spacing.xs
  },
  deckBtnIcon: {
    fontSize: 20
  },
  deckBtnTextCol: {
    flex: 1
  },
  deckBtnTitle: {
    fontSize: 12,
    fontWeight: "700"
  },
  deckBtnSub: {
    fontSize: 10
  },
  performDeedBtn: {
    minHeight: layout.minTouchTarget,
    borderRadius: layout.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: layout.spacing.md,
    marginTop: 4
  },
  performDeedBtnText: {
    color: "#ffffff",
    fontSize: typography.sizes.body,
    fontWeight: "700"
  }
});
