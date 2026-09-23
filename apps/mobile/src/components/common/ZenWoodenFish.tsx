import React, { useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  Vibration,
  View
} from "react-native";
import { useI18n } from "../../i18n/LocaleContext";
import { layout, typography } from "../../theme/theme";
import { useThemeColors } from "../../theme/ThemeContext";

type ZenWoodenFishProps = {
  onTapKarma?: (points: number) => void;
  seniorMode?: boolean;
};

type FloatingParticle = {
  id: number;
  text: string;
  anim: Animated.Value;
};

export function ZenWoodenFish({ onTapKarma, seniorMode }: ZenWoodenFishProps) {
  const currentColors = useThemeColors();
  const { t, locale } = useI18n();
  const [tapCount, setTapCount] = useState(0);
  const [particles, setParticles] = useState<FloatingParticle[]>([]);

  // Physics animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rippleScale = useRef(new Animated.Value(0.8)).current;
  const rippleOpacity = useRef(new Animated.Value(0)).current;
  const malletAnim = useRef(new Animated.Value(0)).current;
  const nextParticleId = useRef(0);

  const getMeritLabel = () => {
    if (locale === "zh-Hans") {
      const items = ["功德 +1", "福报 +1", "善念 +1", "烦恼 -1", "心生欢喜"];
      return items[Math.floor(Math.random() * items.length)];
    }
    if (locale === "ja") return "功徳 +1";
    if (locale === "th") return "บุญ +1";
    if (locale === "fr") return "Mérite +1";
    if (locale === "es") return "Mérito +1";
    return "Karma +1";
  };

  const handlePress = () => {
    try {
      Vibration.vibrate(25);
    } catch (_) {}

    // 0. Mallet strike sequence
    Animated.sequence([
      Animated.timing(malletAnim, {
        toValue: 1,
        duration: 65,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true
      }),
      Animated.spring(malletAnim, {
        toValue: 0,
        friction: 4,
        tension: 55,
        useNativeDriver: true
      })
    ]).start();

    // 1. Spring compression & rebound
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.88,
        duration: 60,
        useNativeDriver: true
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3.5,
        tension: 45,
        useNativeDriver: true
      })
    ]).start();

    // 2. Ripple wave trigger
    rippleScale.setValue(0.7);
    rippleOpacity.setValue(0.75);
    Animated.parallel([
      Animated.timing(rippleScale, {
        toValue: 1.8,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      }),
      Animated.timing(rippleOpacity, {
        toValue: 0,
        duration: 650,
        useNativeDriver: true
      })
    ]).start();

    // 3. Floating merit particle
    const pId = nextParticleId.current++;
    const anim = new Animated.Value(0);
    const text = getMeritLabel();

    setParticles((prev) => [...prev.slice(-4), { id: pId, text, anim }]);

    Animated.timing(anim, {
      toValue: 1,
      duration: 850,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true
    }).start(() => {
      setParticles((prev) => prev.filter((p) => p.id !== pId));
    });

    // 4. Update count and award karma on milestones
    const nextCount = tapCount + 1;
    setTapCount(nextCount);

    if (nextCount % 10 === 0 && onTapKarma) {
      onTapKarma(1);
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: currentColors.surface, borderColor: currentColors.gold }]}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.eyebrow, { color: currentColors.muted }, seniorMode && { fontSize: typography.sizes.caption }]}>
            {t("muyu.eyebrow")}
          </Text>
          <Text style={[styles.title, { color: currentColors.ink }, seniorMode && { fontSize: typography.sizes.titleSenior }]}>
            {t("muyu.title")}
          </Text>
        </View>
        <View style={[styles.pill, { backgroundColor: currentColors.goldGlow }]}>
          <Text style={[styles.pillText, { color: currentColors.gold }]}>
            {t("muyu.knocks", { count: tapCount })}
          </Text>
        </View>
      </View>

      <Text style={[styles.body, { color: currentColors.muted }, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
        {t("muyu.copy")}
      </Text>

      <View style={styles.stage}>
        {/* Animated concentric gold ripple */}
        <Animated.View
          style={[
            styles.ripple,
            {
              borderColor: currentColors.gold,
              transform: [{ scale: rippleScale }],
              opacity: rippleOpacity
            }
          ]}
        />

        {/* Floating particles */}
        {particles.map((p) => {
          const translateY = p.anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -56]
          });
          const opacity = p.anim.interpolate({
            inputRange: [0, 0.2, 0.8, 1],
            outputRange: [0, 1, 0.9, 0]
          });
          const scale = p.anim.interpolate({
            inputRange: [0, 0.2, 1],
            outputRange: [0.6, 1.15, 0.95]
          });

          return (
            <Animated.Text
              key={p.id}
              style={[
                styles.floatingText,
                {
                  color: currentColors.gold,
                  transform: [{ translateY }, { scale }],
                  opacity
                }
              ]}
            >
              {p.text}
            </Animated.Text>
          );
        })}

        {/* Wooden Fish Button */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("muyu.accessibilityLabel")}
          onPress={handlePress}
          style={styles.pressable}
        >
          <Animated.View
            style={[
              styles.muyuBody,
              {
                backgroundColor: currentColors.jade,
                borderColor: currentColors.gold,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            {/* Wooden Fish stylized motifs */}
            <View style={[styles.muyuEye, { borderColor: currentColors.gold }]} />
            <View style={[styles.muyuSlit, { backgroundColor: currentColors.ink }]} />
            <Text style={styles.zenSymbol}>福</Text>
          </Animated.View>
        </Pressable>

        {/* Striker Mallet beside wooden fish */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.malletWrap,
            {
              transform: [
                {
                  rotate: malletAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "-35deg"]
                  })
                },
                {
                  translateX: malletAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -12]
                  })
                },
                {
                  translateY: malletAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 8]
                  })
                }
              ]
            }
          ]}
        >
          <View style={[styles.malletShaft, { backgroundColor: currentColors.gold }]} />
          <View style={[styles.malletHead, { backgroundColor: currentColors.coral, borderColor: currentColors.gold }]} />
        </Animated.View>
      </View>

      <Text style={[styles.hint, { color: currentColors.muted }]}>
        {locale === "zh-Hans" ? "轻叩木鱼，放下万缘 · 每满十击集一分善缘" : "Tap softly for calm · Every 10 knocks earns 1 karma"}
      </Text>
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
  body: {
    fontSize: typography.sizes.body,
    lineHeight: 22
  },
  stage: {
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginVertical: layout.spacing.xs
  },
  ripple: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: layout.borderRadius.full,
    borderWidth: 2
  },
  pressable: {
    minWidth: layout.minTouchTarget,
    minHeight: layout.minTouchTarget,
    alignItems: "center",
    justifyContent: "center"
  },
  muyuBody: {
    width: 96,
    height: 82,
    borderRadius: 36,
    borderWidth: 2.5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 6
  },
  muyuEye: {
    position: "absolute",
    top: 14,
    right: 18,
    width: 12,
    height: 12,
    borderRadius: layout.borderRadius.full,
    borderWidth: 1.8
  },
  muyuSlit: {
    position: "absolute",
    bottom: 14,
    left: 14,
    width: 44,
    height: 8,
    borderRadius: 4
  },
  zenSymbol: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    fontFamily: typography.fontFamilySerif
  },
  floatingText: {
    position: "absolute",
    top: 24,
    fontSize: 18,
    fontWeight: "700",
    fontFamily: typography.fontFamilySerif,
    zIndex: 10
  },
  malletWrap: {
    position: "absolute",
    right: 48,
    top: 22,
    width: 32,
    height: 52,
    alignItems: "center"
  },
  malletShaft: {
    width: 4,
    height: 40,
    borderRadius: 2,
    transform: [{ rotate: "25deg" }]
  },
  malletHead: {
    position: "absolute",
    top: -2,
    left: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4
  },
  hint: {
    fontSize: 12,
    fontStyle: "italic",
    textAlign: "center"
  }
});
