import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  Vibration,
  View
} from "react-native";
import { useI18n } from "../../i18n/LocaleContext";
import { layout, typography } from "../../theme/theme";
import { useThemeColors } from "../../theme/ThemeContext";

type ZenPrayerWheelProps = {
  onSpinRevolution?: () => void;
  seniorMode?: boolean;
};

type FloatingParticle = {
  id: number;
  text: string;
  anim: Animated.Value;
};

export function ZenPrayerWheel({ onSpinRevolution, seniorMode }: ZenPrayerWheelProps) {
  const currentColors = useThemeColors();
  const { t, locale } = useI18n();

  const [revolutions, setRevolutions] = useState(0);
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);
  const [particles, setParticles] = useState<FloatingParticle[]>([]);

  // Physics animation values
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const pendulumAnim = useRef(new Animated.Value(0)).current;
  const haloAnim = useRef(new Animated.Value(0.9)).current;
  const nextParticleId = useRef(0);
  const currentAngle = useRef(0);
  const autoSpinLoop = useRef<Animated.CompositeAnimation | null>(null);

  // Halo breathing glow
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(haloAnim, {
          toValue: 1.18,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(haloAnim, {
          toValue: 0.9,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        })
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const getMeritLabel = () => {
    if (locale.startsWith("zh")) {
      const items = ["转经一匝 · 功德 +1", "福报 +1", "善念 +1", "烦恼 -1", "心生安详"];
      return items[Math.floor(Math.random() * items.length)];
    }
    if (locale === "ja") return "マニ車一転 · 功徳 +1";
    if (locale === "th") return "หมุนกงล้อมนต์ · บุญ +1";
    if (locale === "fr") return "Mérite +1";
    if (locale === "es") return "Mérito +1";
    return "Merit +1";
  };

  const spawnParticle = () => {
    const pId = nextParticleId.current++;
    const pAnim = new Animated.Value(0);
    const text = getMeritLabel();

    setParticles((prev) => [...prev.slice(-4), { id: pId, text, anim: pAnim }]);

    Animated.timing(pAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true
    }).start(() => {
      setParticles((prev) => prev.filter((p) => p.id !== pId));
    });
  };

  const triggerRevolution = () => {
    try {
      Vibration.vibrate(20);
    } catch (_) {}
    setRevolutions((prev) => prev + 1);
    spawnParticle();
    if (onSpinRevolution) {
      onSpinRevolution();
    }
  };

  const spinImpulse = (deltaAngle = 360) => {
    try {
      Vibration.vibrate(10);
    } catch (_) {}
    const targetAngle = currentAngle.current + deltaAngle;
    currentAngle.current = targetAngle;

    // Swing pendulum outward with centrifugal velocity then settle back
    Animated.sequence([
      Animated.timing(pendulumAnim, {
        toValue: 1,
        duration: 250,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true
      }),
      Animated.spring(pendulumAnim, {
        toValue: 0,
        friction: 4,
        tension: 40,
        useNativeDriver: true
      })
    ]).start();

    // Rotate drum with inertia deceleration
    Animated.timing(rotationAnim, {
      toValue: targetAngle,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    }).start(() => {
      triggerRevolution();
    });
  };

  // Auto-spin toggle
  useEffect(() => {
    if (isAutoSpinning) {
      let cancelled = false;
      const step = () => {
        if (cancelled) return;
        currentAngle.current += 360;
        pendulumAnim.setValue(0.45);

        Animated.timing(rotationAnim, {
          toValue: currentAngle.current,
          duration: 3200,
          easing: Easing.linear,
          useNativeDriver: true
        }).start(({ finished }) => {
          if (finished && !cancelled) {
            triggerRevolution();
            step();
          }
        });
      };
      step();

      return () => {
        cancelled = true;
        rotationAnim.stopAnimation();
        pendulumAnim.setValue(0);
      };
    } else {
      pendulumAnim.setValue(0);
    }
  }, [isAutoSpinning]);

  // Pan gesture responder for swipe-to-spin
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 10,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 25) {
          spinImpulse(360);
        } else if (Math.abs(gestureState.dx) <= 25 && Math.abs(gestureState.dy) <= 25) {
          // Tap
          spinImpulse(360);
        }
      }
    })
  ).current;

  // Drum rotation style
  const drumRotation = rotationAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"]
  });

  // Pendulum swing style
  const pendulumRotation = pendulumAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"]
  });

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: currentColors.surface,
          borderColor: currentColors.cardBorder
        }
      ]}
    >
      {/* Header */}
      <View style={styles.rowBetween}>
        <View>
          <Text
            style={[
              styles.eyebrow,
              { color: currentColors.muted },
              seniorMode && { fontSize: typography.sizes.caption }
            ]}
          >
            {t("wheel.eyebrow")}
          </Text>
          <Text
            style={[
              styles.cardTitle,
              { color: currentColors.ink },
              seniorMode && { fontSize: typography.sizes.titleSenior }
            ]}
          >
            {t("wheel.title")}
          </Text>
        </View>
        <View
          style={[
            styles.pill,
            {
              backgroundColor: currentColors.surfaceStrong,
              borderColor: currentColors.line
            }
          ]}
        >
          <Text style={[styles.pillText, { color: currentColors.gold }]}>
            ☸ {t("wheel.turnsCount", { count: revolutions })}
          </Text>
        </View>
      </View>

      <Text
        style={[
          styles.copy,
          { color: currentColors.muted },
          seniorMode && { fontSize: typography.sizes.bodySenior }
        ]}
      >
        {t("wheel.copy")}
      </Text>

      {/* Stage: Drum + Axis + Pendulum + Floating Merit */}
      <View style={styles.stage}>
        {/* Breathing ambient halo */}
        <Animated.View
          style={[
            styles.halo,
            {
              backgroundColor: currentColors.goldGlow,
              transform: [{ scale: haloAnim }]
            }
          ]}
        />

        {/* Prayer Wheel Drum Assembly */}
        <View {...panResponder.panHandlers} style={styles.wheelAssembly}>
          {/* Top Lotus Finial & Jewel */}
          <View style={[styles.jewel, { backgroundColor: currentColors.coral, borderColor: currentColors.gold }]} />
          <View style={[styles.finialCrown, { backgroundColor: currentColors.gold }]} />

          {/* Central Spindle Axis */}
          <View style={[styles.axisSpindle, { backgroundColor: currentColors.gold }]} />

          {/* Rotating Wheel Cylinder */}
          <Animated.View
            style={[
              styles.cylinderBody,
              {
                backgroundColor: currentColors.surfaceStrong,
                borderColor: currentColors.gold,
                transform: [{ rotateY: drumRotation }]
              }
            ]}
          >
            {/* Top & Bottom Embossed Rims */}
            <View style={[styles.cylinderRimTop, { borderColor: currentColors.gold }]} />
            
            {/* Six-Syllable Mantra Glyph */}
            <View style={styles.mantraCenter}>
              <Text style={[styles.mantraText, { color: currentColors.gold }]}>
                唵嘛呢叭咪吽
              </Text>
            </View>

            <View style={[styles.cylinderRimBottom, { borderColor: currentColors.gold }]} />
          </Animated.View>

          {/* Swinging weighted pendulum cord & golden bead */}
          <Animated.View
            style={[
              styles.pendulumAnchor,
              {
                transform: [{ rotate: pendulumRotation }]
              }
            ]}
          >
            <View style={[styles.pendulumCord, { backgroundColor: currentColors.gold }]} />
            <View
              style={[
                styles.pendulumBead,
                {
                  backgroundColor: currentColors.gold,
                  borderColor: currentColors.gold
                }
              ]}
            />
          </Animated.View>

          {/* Base Pedestal & Handle */}
          <View style={[styles.pedestalBase, { backgroundColor: currentColors.gold }]} />
          <View style={[styles.handleWood, { backgroundColor: currentColors.ink, borderColor: currentColors.gold }]} />
          <View style={[styles.handleTip, { backgroundColor: currentColors.gold }]} />
        </View>

        {/* Floating merit particles */}
        {particles.map((p) => {
          const translateY = p.anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -65]
          });
          const opacity = p.anim.interpolate({
            inputRange: [0, 0.15, 0.75, 1],
            outputRange: [0, 1, 0.85, 0]
          });

          return (
            <Animated.View
              key={p.id}
              pointerEvents="none"
              style={[
                styles.floatingParticle,
                {
                  opacity,
                  transform: [{ translateY }]
                }
              ]}
            >
              <Text style={[styles.particleText, { color: currentColors.gold }]}>
                {p.text}
              </Text>
            </Animated.View>
          );
        })}
      </View>

      {/* Six Syllables Mantra strip */}
      <View
        style={[
          styles.mantraStrip,
          {
            backgroundColor: currentColors.goldGlow,
            borderColor: currentColors.gold
          }
        ]}
      >
        <Text style={[styles.stripChar, { color: currentColors.coral }]}>唵</Text>
        <Text style={[styles.stripDot, { color: currentColors.gold }]}>·</Text>
        <Text style={[styles.stripChar, { color: currentColors.coral }]}>嘛</Text>
        <Text style={[styles.stripDot, { color: currentColors.gold }]}>·</Text>
        <Text style={[styles.stripChar, { color: currentColors.coral }]}>呢</Text>
        <Text style={[styles.stripDot, { color: currentColors.gold }]}>·</Text>
        <Text style={[styles.stripChar, { color: currentColors.coral }]}>叭</Text>
        <Text style={[styles.stripDot, { color: currentColors.gold }]}>·</Text>
        <Text style={[styles.stripChar, { color: currentColors.coral }]}>咪</Text>
        <Text style={[styles.stripDot, { color: currentColors.gold }]}>·</Text>
        <Text style={[styles.stripChar, { color: currentColors.coral }]}>吽</Text>
      </View>

      {/* Controls */}
      <View style={styles.controlsRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isAutoSpinning ? t("wheel.pauseAuto") : t("wheel.autoSpin")}
          style={[
            styles.autoButton,
            {
              backgroundColor: isAutoSpinning ? currentColors.gold : currentColors.surfaceStrong,
              borderColor: isAutoSpinning ? currentColors.gold : currentColors.line
            }
          ]}
          onPress={() => setIsAutoSpinning((prev) => !prev)}
        >
          <Text
            style={[
              styles.autoButtonText,
              { color: isAutoSpinning ? currentColors.surfaceStrong : currentColors.ink },
              seniorMode && { fontSize: typography.sizes.body }
            ]}
          >
            {isAutoSpinning ? t("wheel.pauseAuto") : t("wheel.autoSpin")}
          </Text>
        </Pressable>

        <Text style={[styles.hintText, { color: currentColors.muted }]}>
          {t("wheel.hint")}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: layout.spacing.md,
    borderRadius: layout.borderRadius.lg,
    borderWidth: 1.5,
    gap: layout.spacing.sm
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  eyebrow: {
    fontSize: typography.sizes.eyebrow,
    textTransform: "uppercase",
    letterSpacing: 0.8
  },
  cardTitle: {
    fontSize: typography.sizes.title,
    fontWeight: "700",
    fontFamily: typography.fontFamilySerif
  },
  pill: {
    paddingVertical: 4,
    paddingHorizontal: layout.spacing.sm,
    borderRadius: 999,
    borderWidth: 1
  },
  pillText: {
    fontSize: typography.sizes.caption,
    fontWeight: "600"
  },
  copy: {
    fontSize: typography.sizes.body,
    lineHeight: 20
  },
  stage: {
    minHeight: 230,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    paddingVertical: layout.spacing.md
  },
  halo: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90
  },
  wheelAssembly: {
    alignItems: "center",
    position: "relative",
    width: 140,
    height: 200,
    justifyContent: "flex-start"
  },
  jewel: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    zIndex: 5
  },
  finialCrown: {
    width: 28,
    height: 8,
    borderRadius: 4,
    marginTop: -2,
    zIndex: 5
  },
  axisSpindle: {
    position: "absolute",
    top: 10,
    width: 6,
    height: 180,
    borderRadius: 3,
    zIndex: 1
  },
  cylinderBody: {
    width: 110,
    height: 105,
    borderRadius: layout.borderRadius.md,
    borderWidth: 2,
    zIndex: 3,
    marginTop: 4,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8
  },
  cylinderRimTop: {
    width: "90%",
    height: 8,
    borderBottomWidth: 1.5,
    borderTopWidth: 1.5,
    opacity: 0.8
  },
  mantraCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  mantraText: {
    fontFamily: typography.fontFamilySerif,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1
  },
  cylinderRimBottom: {
    width: "90%",
    height: 8,
    borderBottomWidth: 1.5,
    borderTopWidth: 1.5,
    opacity: 0.8
  },
  pendulumAnchor: {
    position: "absolute",
    top: 60,
    right: 8,
    width: 35,
    height: 40,
    zIndex: 4,
    transformOrigin: "top left"
  },
  pendulumCord: {
    width: 2,
    height: 24,
    borderRadius: 1,
    transform: [{ rotate: "25deg" }]
  },
  pendulumBead: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    marginTop: -4,
    marginLeft: 10
  },
  pedestalBase: {
    width: 70,
    height: 12,
    borderRadius: 6,
    marginTop: 2,
    zIndex: 4
  },
  handleWood: {
    width: 14,
    height: 52,
    borderRadius: 4,
    borderWidth: 1,
    marginTop: -2,
    zIndex: 2
  },
  handleTip: {
    width: 16,
    height: 8,
    borderRadius: 4,
    marginTop: -2,
    zIndex: 3
  },
  floatingParticle: {
    position: "absolute",
    top: 30,
    zIndex: 10,
    alignSelf: "center"
  },
  particleText: {
    fontFamily: typography.fontFamilySerif,
    fontSize: 18,
    fontWeight: "700",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3
  },
  mantraStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: layout.spacing.xs,
    paddingHorizontal: layout.spacing.md,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: "center",
    marginVertical: layout.spacing.xs
  },
  stripChar: {
    fontFamily: typography.fontFamilySerif,
    fontSize: typography.sizes.body,
    fontWeight: "700"
  },
  stripDot: {
    fontSize: typography.sizes.caption,
    fontWeight: "600"
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: layout.spacing.xs
  },
  autoButton: {
    minHeight: 40,
    paddingHorizontal: layout.spacing.md,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  autoButtonText: {
    fontSize: typography.sizes.caption,
    fontWeight: "600"
  },
  hintText: {
    fontSize: typography.sizes.caption,
    fontStyle: "italic"
  }
});
