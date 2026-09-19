import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useI18n } from "../../i18n/LocaleContext";
import { layout, typography } from "../../theme/theme";
import { useThemeColors } from "../../theme/ThemeContext";

type IncenseIntention = "peace" | "clarity" | "gratitude" | "release";

const intentions: IncenseIntention[] = ["peace", "clarity", "gratitude", "release"];

type VirtualIncenseProps = {
  onKindleIncense?: () => void;
  seniorMode?: boolean;
};

export function VirtualIncense({ onKindleIncense, seniorMode }: VirtualIncenseProps) {
  const currentColors = useThemeColors();
  const { t } = useI18n();

  const [selectedIntent, setSelectedIntent] = useState<IncenseIntention>("peace");
  const [litCount, setLitCount] = useState(0);
  const [isBurning, setIsBurning] = useState(false);

  // Animations
  const emberPulse = useRef(new Animated.Value(0.4)).current;
  const smokeAnim1 = useRef(new Animated.Value(0)).current;
  const smokeAnim2 = useRef(new Animated.Value(0)).current;
  const smokeAnim3 = useRef(new Animated.Value(0)).current;

  // Running smoke animations
  useEffect(() => {
    let animLoop: Animated.CompositeAnimation | null = null;

    if (isBurning) {
      // Ember glowing pulse
      Animated.loop(
        Animated.sequence([
          Animated.timing(emberPulse, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          }),
          Animated.timing(emberPulse, {
            toValue: 0.5,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          })
        ])
      ).start();

      // Smoke loops with staggered phases
      const createSmokeLoop = (anim: Animated.Value, duration: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true
            })
          ])
        );
      };

      const loop1 = createSmokeLoop(smokeAnim1, 3200);
      const loop2 = createSmokeLoop(smokeAnim2, 3800);
      const loop3 = createSmokeLoop(smokeAnim3, 3500);

      animLoop = Animated.parallel([loop1, loop2, loop3]);
      animLoop.start();
    } else {
      emberPulse.setValue(0.3);
      smokeAnim1.setValue(0);
      smokeAnim2.setValue(0);
      smokeAnim3.setValue(0);
    }

    return () => {
      if (animLoop) animLoop.stop();
    };
  }, [isBurning]);

  const handleKindle = () => {
    setIsBurning(true);
    setLitCount((prev) => prev + 1);
    if (onKindleIncense) {
      onKindleIncense();
    }

    // Auto quiet down after 30 seconds of mindful burning
    setTimeout(() => {
      setIsBurning(false);
    }, 30000);
  };

  return (
    <View style={[styles.card, { backgroundColor: currentColors.surface, borderColor: currentColors.cardBorder }]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.eyebrow, { color: currentColors.muted }, seniorMode && { fontSize: typography.sizes.caption }]}>
            {t("incense.eyebrow")}
          </Text>
          <Text style={[styles.title, { color: currentColors.ink }, seniorMode && { fontSize: typography.sizes.titleSenior }]}>
            {t("incense.title")}
          </Text>
        </View>
        <View style={[styles.pill, { backgroundColor: currentColors.goldGlow }]}>
          <Text style={[styles.pillText, { color: currentColors.gold }]}>
            {t("incense.count", { count: litCount })}
          </Text>
        </View>
      </View>

      <Text style={[styles.copy, { color: currentColors.muted }, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
        {t("incense.copy")}
      </Text>

      {/* Intention Choices */}
      <View style={styles.intentionsRow}>
        {intentions.map((intent) => {
          const isActive = selectedIntent === intent;
          return (
            <Pressable
              key={intent}
              onPress={() => setSelectedIntent(intent)}
              style={[
                styles.intentChip,
                {
                  backgroundColor: isActive ? currentColors.bamboo : currentColors.surfaceStrong,
                  borderColor: isActive ? currentColors.bamboo : currentColors.line
                }
              ]}
            >
              <Text
                style={[
                  styles.intentChipText,
                  { color: isActive ? currentColors.surfaceStrong : currentColors.ink },
                  seniorMode && { fontSize: typography.sizes.body }
                ]}
              >
                {t(`incense.${intent}`)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Virtual Incense Stage */}
      <View style={styles.stage}>
        {/* Animated Smoke Layers */}
        {isBurning && (
          <View style={styles.smokeWrap} pointerEvents="none">
            {/* Left Smoke */}
            <Animated.View
              style={[
                styles.smokeRibbon,
                {
                  left: 20,
                  opacity: smokeAnim1.interpolate({
                    inputRange: [0, 0.3, 0.8, 1],
                    outputRange: [0, 0.6, 0.3, 0]
                  }),
                  transform: [
                    {
                      translateY: smokeAnim1.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -70]
                      })
                    },
                    {
                      translateX: smokeAnim1.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, -12, 10]
                      })
                    },
                    {
                      scaleX: smokeAnim1.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1.8]
                      })
                    }
                  ]
                }
              ]}
            />
            {/* Mid Smoke */}
            <Animated.View
              style={[
                styles.smokeRibbon,
                {
                  left: 45,
                  opacity: smokeAnim2.interpolate({
                    inputRange: [0, 0.35, 0.75, 1],
                    outputRange: [0, 0.7, 0.35, 0]
                  }),
                  transform: [
                    {
                      translateY: smokeAnim2.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -80]
                      })
                    },
                    {
                      translateX: smokeAnim2.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, 8, -8]
                      })
                    },
                    {
                      scaleX: smokeAnim2.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.6, 2]
                      })
                    }
                  ]
                }
              ]}
            />
            {/* Right Smoke */}
            <Animated.View
              style={[
                styles.smokeRibbon,
                {
                  right: 20,
                  opacity: smokeAnim3.interpolate({
                    inputRange: [0, 0.25, 0.7, 1],
                    outputRange: [0, 0.55, 0.25, 0]
                  }),
                  transform: [
                    {
                      translateY: smokeAnim3.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -72]
                      })
                    },
                    {
                      translateX: smokeAnim3.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, 14, -6]
                      })
                    },
                    {
                      scaleX: smokeAnim3.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1.7]
                      })
                    }
                  ]
                }
              ]}
            />
          </View>
        )}

        {/* 3 Incense Sticks */}
        <View style={styles.sticksWrap}>
          {/* Stick 1 (Left tilted) */}
          <View style={[styles.stickContainer, { transform: [{ rotate: "-7deg" }] }]}>
            <Animated.View
              style={[
                styles.ember,
                {
                  opacity: emberPulse,
                  transform: [{ scale: isBurning ? emberPulse : 0.8 }]
                }
              ]}
            />
            <View style={styles.stickShaft} />
          </View>
          {/* Stick 2 (Center) */}
          <View style={[styles.stickContainer, { height: 62 }]}>
            <Animated.View
              style={[
                styles.ember,
                {
                  opacity: emberPulse,
                  transform: [{ scale: isBurning ? emberPulse : 0.8 }]
                }
              ]}
            />
            <View style={styles.stickShaft} />
          </View>
          {/* Stick 3 (Right tilted) */}
          <View style={[styles.stickContainer, { transform: [{ rotate: "7deg" }] }]}>
            <Animated.View
              style={[
                styles.ember,
                {
                  opacity: emberPulse,
                  transform: [{ scale: isBurning ? emberPulse : 0.8 }]
                }
              ]}
            />
            <View style={styles.stickShaft} />
          </View>
        </View>

        {/* Bronze Censer Vessel */}
        <View style={[styles.censerBody, { borderColor: currentColors.gold }]}>
          <View style={[styles.censerAsh, { borderColor: currentColors.gold }]} />
          <View style={[styles.censerLegsRow]}>
            <View style={[styles.censerLeg, { backgroundColor: currentColors.gold }]} />
            <View style={[styles.censerLeg, { backgroundColor: currentColors.gold }]} />
            <View style={[styles.censerLeg, { backgroundColor: currentColors.gold }]} />
          </View>
        </View>
      </View>

      {/* Burning Status notice */}
      {isBurning && (
        <View style={[styles.statusLine, { backgroundColor: currentColors.goldGlow }]}>
          <Text style={[styles.statusDot, { color: currentColors.gold }]}>●</Text>
          <Text style={[styles.statusText, { color: currentColors.gold }]}>
            {t("incense.burning")}
          </Text>
        </View>
      )}

      {/* Action Button */}
      <Pressable
        style={[styles.primaryButton, { backgroundColor: currentColors.bamboo }]}
        onPress={handleKindle}
      >
        <Text style={[styles.primaryButtonText, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
          {t("incense.light")}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: layout.spacing.md,
    borderRadius: layout.borderRadius.lg,
    borderWidth: 1.5,
    gap: layout.spacing.xs,
    marginVertical: layout.spacing.xs
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  eyebrow: {
    fontSize: typography.sizes.eyebrow,
    textTransform: "uppercase",
    letterSpacing: 0.8
  },
  title: {
    fontSize: typography.sizes.title,
    fontWeight: "700",
    fontFamily: typography.fontFamilySerif
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
  copy: {
    fontSize: typography.sizes.body,
    lineHeight: 22
  },
  intentionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: layout.spacing.xs
  },
  intentChip: {
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: 6,
    borderRadius: layout.borderRadius.full,
    borderWidth: 1,
    minHeight: 36,
    justifyContent: "center"
  },
  intentChipText: {
    fontSize: 13,
    fontWeight: "600"
  },
  stage: {
    height: 135,
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
    paddingBottom: 8
  },
  smokeWrap: {
    position: "absolute",
    bottom: 46,
    width: 120,
    height: 80
  },
  smokeRibbon: {
    position: "absolute",
    bottom: 0,
    width: 24,
    height: 60,
    borderRadius: 12,
    backgroundColor: "rgba(220, 215, 205, 0.45)"
  },
  sticksWrap: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-end",
    position: "absolute",
    bottom: 24,
    zIndex: 2
  },
  stickContainer: {
    width: 4,
    height: 54,
    alignItems: "center",
    justifyContent: "space-between"
  },
  stickShaft: {
    width: 3,
    flex: 1,
    backgroundColor: "#7a2e18",
    borderRadius: 1
  },
  ember: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#ff5400"
  },
  censerBody: {
    width: 110,
    height: 38,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderWidth: 2,
    backgroundColor: "#4a3518",
    alignItems: "center",
    justifyContent: "flex-start",
    zIndex: 3
  },
  censerAsh: {
    width: 96,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    backgroundColor: "#686259",
    marginTop: 2
  },
  censerLegsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 76,
    position: "absolute",
    bottom: -8
  },
  censerLeg: {
    width: 5,
    height: 9,
    borderRadius: 2.5
  },
  statusLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: 4,
    borderRadius: layout.borderRadius.sm
  },
  statusDot: {
    fontSize: 10
  },
  statusText: {
    fontSize: 12,
    fontStyle: "italic",
    fontWeight: "600"
  },
  primaryButton: {
    minHeight: layout.minTouchTarget,
    borderRadius: layout.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: layout.spacing.md
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: typography.sizes.body,
    fontWeight: "700"
  }
});
