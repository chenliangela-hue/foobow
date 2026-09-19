import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View
} from "react-native";
import { layout } from "../../theme/theme";
import { useThemeColors } from "../../theme/ThemeContext";

type LotusPondSceneProps = {
  isReleased?: boolean;
  seniorMode?: boolean;
};

export function LotusPondScene({ isReleased, seniorMode }: LotusPondSceneProps) {
  const currentColors = useThemeColors();

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

  return (
    <View style={[styles.pondContainer, { borderColor: currentColors.gold }]}>
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

      {/* Soft shoreline curve */}
      <View style={styles.shoreline} pointerEvents="none" />
    </View>
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
  shoreline: {
    position: "absolute",
    bottom: -20,
    left: -10,
    right: -10,
    height: 36,
    backgroundColor: "#cbb382",
    transform: [{ rotate: "-3deg" }],
    opacity: 0.3
  }
});
