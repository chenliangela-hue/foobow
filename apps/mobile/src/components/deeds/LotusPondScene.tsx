import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  Vibration,
  View
} from "react-native";
import { layout } from "../../theme/theme";
import { useThemeColors } from "../../theme/ThemeContext";

type LotusPondSceneProps = {
  isReleased?: boolean;
  seniorMode?: boolean;
  onInteractiveRelease?: () => void;
};

export function LotusPondScene({ isReleased, seniorMode, onInteractiveRelease }: LotusPondSceneProps) {
  const currentColors = useThemeColors();
  const [interactiveCount, setInteractiveCount] = useState(0);
  const [species, setSpecies] = useState<"yamabuki" | "kohaku" | "turtle">("yamabuki");
  const [comboCount, setComboCount] = useState(0);
  const touchRippleAnim = useRef(new Animated.Value(0)).current;
  const touchCrumbAnim = useRef(new Animated.Value(0)).current;
  const comboTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Swimming koi orbit animations
  const koiOrbitAnim = useRef(new Animated.Value(0)).current;
  const koiTailAnim = useRef(new Animated.Value(0)).current;

  // Lotus gentle floating animation
  const lotusFloatAnim = useRef(new Animated.Value(0)).current;

  // Released fish swoop animation
  const releaseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Koi orbit loop
    const orbitLoop = Animated.loop(
      Animated.timing(koiOrbitAnim, {
        toValue: 1,
        duration: 12000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    );
    orbitLoop.start();

    // 2. Koi tail waggle loop
    const tailLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(koiTailAnim, {
          toValue: 1,
          duration: 350,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true
        }),
        Animated.timing(koiTailAnim, {
          toValue: -1,
          duration: 350,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true
        })
      ])
    );
    tailLoop.start();

    // 3. Lotus float loop
    const lotusLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(lotusFloatAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true
        }),
        Animated.timing(lotusFloatAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true
        })
      ])
    );
    lotusLoop.start();

    return () => {
      orbitLoop.stop();
      tailLoop.stop();
      lotusLoop.stop();
    };
  }, []);

  useEffect(() => {
    if (isReleased) {
      releaseAnim.setValue(0);
      Animated.timing(releaseAnim, {
        toValue: 1,
        duration: 2800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      }).start();
    }
  }, [isReleased]);

  // Interpolations for swimming koi orbit
  const koiTranslateX = koiOrbitAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [-35, 30, 40, -25, -35]
  });

  const koiTranslateY = koiOrbitAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [-15, -20, 18, 22, -15]
  });

  const koiRotate = koiOrbitAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ["20deg", "85deg", "190deg", "260deg", "380deg"]
  });

  const tailRotate = koiTailAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-16deg", "16deg"]
  });

  const lotusTranslateY = lotusFloatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -5]
  });

  const handlePondPress = () => {
    try {
      Vibration.vibrate(15);
    } catch {}
    setInteractiveCount((c) => c + 1);
    setComboCount((c) => c + 1);
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    comboTimerRef.current = setTimeout(() => setComboCount(0), 3200);

    touchRippleAnim.setValue(0);
    Animated.timing(touchRippleAnim, {
      toValue: 1,
      duration: 1200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true
    }).start();

    touchCrumbAnim.setValue(0);
    Animated.sequence([
      Animated.timing(touchCrumbAnim, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true
      }),
      Animated.timing(touchCrumbAnim, {
        toValue: 0,
        duration: 650,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true
      })
    ]).start();

    releaseAnim.setValue(0);
    Animated.timing(releaseAnim, {
      toValue: 1,
      duration: 2400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    }).start();

    if (onInteractiveRelease) {
      onInteractiveRelease();
    }
  };

  return (
    <Pressable
      style={[styles.pondContainer, { borderColor: currentColors.gold }]}
      onPress={handlePondPress}
      accessibilityRole="button"
      accessibilityLabel="Zen lotus pond, tap to release swimming koi"
    >
      {/* Interactive touch ripple ring */}
      <Animated.View
        style={[
          styles.touchRippleRing,
          {
            opacity: touchRippleAnim.interpolate({
              inputRange: [0, 0.7, 1],
              outputRange: [0.8, 0.3, 0]
            }),
            transform: [
              {
                scale: touchRippleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.2, 3.5]
                })
              }
            ]
          }
        ]}
        pointerEvents="none"
      />
      {/* Water shimmer backdrop */}
      <View style={styles.waterShimmer} pointerEvents="none" />

      {/* Floating Lily Pad 1 */}
      <View style={[styles.lilyPad, styles.pad1]} pointerEvents="none">
        <View style={styles.padNotch} />
      </View>

      {/* Floating Lily Pad 2 */}
      <View style={[styles.lilyPad, styles.pad2]} pointerEvents="none">
        <View style={styles.padNotch} />
      </View>

      {/* Floating Lotus Flower */}
      <Animated.View
        style={[
          styles.lotusFlower,
          { transform: [{ translateY: lotusTranslateY }] }
        ]}
        pointerEvents="none"
      >
        <Text style={styles.lotusEmoji}>🪷</Text>
      </Animated.View>

      {/* Swimming Koi Fish */}
      <Animated.View
        style={[
          styles.koiWrap,
          {
            transform: [
              { translateX: koiTranslateX },
              { translateY: koiTranslateY },
              { rotate: koiRotate }
            ]
          }
        ]}
        pointerEvents="none"
      >
        {/* Koi Body */}
        <View style={styles.koiBody}>
          {/* Calico/Orange patches */}
          <View style={styles.koiPatchOrange} />
          <View style={styles.koiPatchGold} />
          {/* Head */}
          <View style={styles.koiHead} />
          {/* Fin */}
          <View style={styles.koiFinTop} />
          <View style={styles.koiFinBot} />
          {/* Tail */}
          <Animated.View
            style={[styles.koiTail, { transform: [{ rotate: tailRotate }] }]}
          />
        </View>
      </Animated.View>

      {/* Released Golden Koi Fish (Appears on release) */}
      {isReleased && (
        <Animated.View
          style={[
            styles.releasedKoiWrap,
            {
              opacity: releaseAnim.interpolate({
                inputRange: [0, 0.2, 0.8, 1],
                outputRange: [0, 1, 0.9, 0]
              }),
              transform: [
                {
                  translateX: releaseAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [20, -35, -90]
                  })
                },
                {
                  translateY: releaseAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [30, -10, -50]
                  })
                },
                {
                  scale: releaseAnim.interpolate({
                    inputRange: [0, 0.3, 1],
                    outputRange: [0.5, 1.1, 0.7]
                  })
                },
                {
                  rotate: releaseAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["-30deg", "-65deg"]
                  })
                }
              ]
            }
          ]}
          pointerEvents="none"
        >
          <View style={[styles.koiBody, styles.goldKoiBody]}>
            <View style={[styles.koiHead, styles.goldKoiHead]} />
            <View style={[styles.koiTail, styles.goldKoiTail]} />
          </View>
        </Animated.View>
      )}

      {/* Interactive Food Pellet Particle */}
      <Animated.View
        style={[
          styles.foodPellet,
          {
            opacity: touchCrumbAnim.interpolate({
              inputRange: [0, 0.2, 1],
              outputRange: [0, 1, 0.9]
            }),
            transform: [
              {
                translateY: touchCrumbAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-18, 12]
                })
              },
              {
                scale: touchCrumbAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.5, 1.3, 0.8]
                })
              }
            ]
          }
        ]}
        pointerEvents="none"
      />

      {/* Interactive Released Counter & Badge Pill */}
      {interactiveCount > 0 && (
        <View style={styles.interactivePill} pointerEvents="none">
          <Text style={styles.interactivePillText}>
            {interactiveCount >= 5
              ? `🏅 Guardian (${interactiveCount})`
              : `${species === "turtle" ? "🐢" : "🐟"} Released: ${interactiveCount}`}
            {comboCount > 1 ? ` · ✨ ${comboCount >= 3 ? "3x Bloom" : "2x Flow"}` : ""}
          </Text>
        </View>
      )}

      {/* Species Selector Mini Bar */}
      <View style={styles.speciesBar}>
        <Pressable
          style={[styles.speciesChip, species === "yamabuki" && styles.speciesChipActive]}
          onPress={() => {
            try { Vibration.vibrate(10); } catch {}
            setSpecies("yamabuki");
          }}
          accessibilityRole="button"
          accessibilityLabel="Golden Koi"
        >
          <Text style={styles.speciesChipText}>🟡</Text>
        </Pressable>
        <Pressable
          style={[styles.speciesChip, species === "kohaku" && styles.speciesChipActive]}
          onPress={() => {
            try { Vibration.vibrate(10); } catch {}
            setSpecies("kohaku");
          }}
          accessibilityRole="button"
          accessibilityLabel="Red and White Koi"
        >
          <Text style={styles.speciesChipText}>🔴</Text>
        </Pressable>
        <Pressable
          style={[styles.speciesChip, species === "turtle" && styles.speciesChipActive]}
          onPress={() => {
            try { Vibration.vibrate(10); } catch {}
            setSpecies("turtle");
          }}
          accessibilityRole="button"
          accessibilityLabel="River Terrapin"
        >
          <Text style={styles.speciesChipText}>🐢</Text>
        </Pressable>
      </View>

      {/* Soft shoreline curve */}
      <View style={styles.shoreline} pointerEvents="none" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pondContainer: {
    height: 150,
    borderRadius: layout.borderRadius.lg,
    borderWidth: 1.5,
    backgroundColor: "#0d2b33",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginVertical: layout.spacing.xs
  },
  waterShimmer: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(30, 85, 96, 0.35)"
  },
  lilyPad: {
    position: "absolute",
    backgroundColor: "#1b5e3b",
    borderWidth: 1,
    borderColor: "rgba(80, 200, 120, 0.35)",
    overflow: "hidden"
  },
  pad1: {
    width: 36,
    height: 32,
    borderRadius: 18,
    top: 18,
    left: 28
  },
  pad2: {
    width: 28,
    height: 24,
    borderRadius: 14,
    bottom: 24,
    right: 36
  },
  padNotch: {
    position: "absolute",
    top: "50%",
    right: -2,
    width: 0,
    height: 0,
    borderRightWidth: 8,
    borderRightColor: "#0d2b33",
    borderTopWidth: 4,
    borderTopColor: "transparent",
    borderBottomWidth: 4,
    borderBottomColor: "transparent"
  },
  lotusFlower: {
    position: "absolute",
    top: 14,
    left: 54,
    zIndex: 3
  },
  lotusEmoji: {
    fontSize: 26
  },
  koiWrap: {
    position: "absolute",
    width: 50,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 4
  },
  koiBody: {
    width: 36,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e65c00",
    position: "relative"
  },
  koiPatchOrange: {
    position: "absolute",
    width: 14,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#f77f00",
    top: 2,
    left: 8
  },
  koiPatchGold: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#d62828",
    top: 3,
    right: 6
  },
  koiHead: {
    position: "absolute",
    right: -2,
    top: 3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#f77f00"
  },
  koiFinTop: {
    position: "absolute",
    top: -5,
    left: 12,
    width: 8,
    height: 5,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.7)"
  },
  koiFinBot: {
    position: "absolute",
    bottom: -5,
    left: 12,
    width: 8,
    height: 5,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.7)"
  },
  koiTail: {
    position: "absolute",
    left: -10,
    top: 2,
    width: 12,
    height: 10,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    backgroundColor: "rgba(247, 127, 0, 0.85)"
  },
  releasedKoiWrap: {
    position: "absolute",
    width: 50,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5
  },
  goldKoiBody: {
    backgroundColor: "#ffe8a3",
    borderColor: "#f6d37a"
  },
  goldKoiHead: {
    backgroundColor: "#f6d37a"
  },
  goldKoiTail: {
    backgroundColor: "rgba(246, 211, 122, 0.9)"
  },
  foodPellet: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ffd166",
    borderWidth: 1,
    borderColor: "#e65c00",
    top: 60,
    zIndex: 6
  },
  shoreline: {
    position: "absolute",
    bottom: -20,
    left: -10,
    right: -10,
    height: 36,
    backgroundColor: "#cbb382",
    transform: [{ rotate: "-3deg" }],
    opacity: 0.3
  },
  touchRippleRing: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#efc978",
    zIndex: 2
  },
  interactivePill: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(10, 36, 40, 0.8)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(239, 201, 120, 0.5)",
    zIndex: 10
  },
  interactivePillText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#ffe7ad"
  },
  speciesBar: {
    position: "absolute",
    bottom: 8,
    left: 8,
    flexDirection: "row",
    gap: 4,
    backgroundColor: "rgba(10, 36, 40, 0.75)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    zIndex: 10
  },
  speciesChip: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 999
  },
  speciesChipActive: {
    backgroundColor: "rgba(239, 201, 120, 0.35)",
    borderWidth: 1,
    borderColor: "#efc978"
  },
  speciesChipText: {
    fontSize: 12
  }
});
