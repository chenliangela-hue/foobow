import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { useI18n } from "../../i18n/LocaleContext";
import { useThemeColors } from "../../theme/ThemeContext";
import { layout, typography } from "../../theme/theme";

type SanskritChantsCardProps = {
  onCompleteMeditation: (points: number) => void;
  seniorMode?: boolean;
};

const CHANT_TRACKS = [
  { id: "da_bei_zhou", key: "trackDaBeiZhou", icon: "📿", defaultTitle: "大悲咒 · Great Compassion Mantra" },
  { id: "heart_sutra", key: "trackHeartSutra", icon: "📜", defaultTitle: "心经 · Heart Sutra" },
  { id: "bodhi_theme", key: "trackBodhiTheme", icon: "🪷", defaultTitle: "菩提苑主题曲 · Bodhi Theme" }
] as const;

export function SanskritChantsCard({ onCompleteMeditation, seniorMode }: SanskritChantsCardProps) {
  const currentColors = useThemeColors();
  const { t } = useI18n();

  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [completeToast, setCompleteToast] = useState<string | null>(null);

  // Equalizer wave bar animations
  const bar1 = useRef(new Animated.Value(0.3)).current;
  const bar2 = useRef(new Animated.Value(0.6)).current;
  const bar3 = useRef(new Animated.Value(0.4)).current;
  const bar4 = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setSessionSeconds((s) => s + 1);
      }, 1000);

      const anim1 = Animated.loop(
        Animated.sequence([
          Animated.timing(bar1, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(bar1, { toValue: 0.2, duration: 400, useNativeDriver: true })
        ])
      );
      const anim2 = Animated.loop(
        Animated.sequence([
          Animated.timing(bar2, { toValue: 1, duration: 550, useNativeDriver: true }),
          Animated.timing(bar2, { toValue: 0.3, duration: 550, useNativeDriver: true })
        ])
      );
      const anim3 = Animated.loop(
        Animated.sequence([
          Animated.timing(bar3, { toValue: 1, duration: 450, useNativeDriver: true }),
          Animated.timing(bar3, { toValue: 0.25, duration: 450, useNativeDriver: true })
        ])
      );
      const anim4 = Animated.loop(
        Animated.sequence([
          Animated.timing(bar4, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.timing(bar4, { toValue: 0.2, duration: 600, useNativeDriver: true })
        ])
      );

      anim1.start();
      anim2.start();
      anim3.start();
      anim4.start();

      return () => {
        if (timer) clearInterval(timer);
        anim1.stop();
        anim2.stop();
        anim3.stop();
        anim4.stop();
      };
    } else {
      bar1.setValue(0.3);
      bar2.setValue(0.5);
      bar3.setValue(0.35);
      bar4.setValue(0.4);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, bar1, bar2, bar3, bar4]);

  const activeTrack = CHANT_TRACKS[activeTrackIndex];

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleComplete = () => {
    if (sessionSeconds >= 30) {
      onCompleteMeditation(10);
      setCompleteToast(t("chants.completeSuccess"));
      setSessionSeconds(0);
      setIsPlaying(false);
      setTimeout(() => setCompleteToast(null), 3500);
    } else {
      setCompleteToast(t("chants.completeShort"));
      setTimeout(() => setCompleteToast(null), 3000);
    }
  };

  const mins = Math.floor(sessionSeconds / 60);
  const secs = sessionSeconds % 60;

  return (
    <View style={[styles.card, { backgroundColor: currentColors.surface, borderColor: currentColors.gold }]}>
      <View style={styles.headerRow}>
        <View style={styles.flexOne}>
          <Text style={[styles.eyebrow, { color: currentColors.gold }]}>
            {t("chants.eyebrow")}
          </Text>
          <Text style={[styles.title, { color: currentColors.ink }, seniorMode && { fontSize: typography.sizes.titleSenior }]}>
            {t("chants.title")}
          </Text>
        </View>
        <Text style={styles.lotusIcon}>📿</Text>
      </View>

      <Text style={[styles.copy, { color: currentColors.muted }, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
        {t("chants.subtitle")}
      </Text>

      {/* Active Track Hero Box */}
      <View style={[styles.trackHero, { backgroundColor: currentColors.goldGlow, borderColor: currentColors.gold }]}>
        <Text style={styles.trackIcon}>{activeTrack.icon}</Text>
        <View style={styles.flexOne}>
          <Text style={[styles.trackName, { color: currentColors.ink }]}>
            {t(`chants.${activeTrack.key}` as any) || activeTrack.defaultTitle}
          </Text>
          <View style={styles.metaRow}>
            <Text style={[styles.statusText, { color: currentColors.gold }]}>
              {isPlaying ? t("chants.playing") : t("chants.paused")} · {mins}m {secs}s
            </Text>
            {isPlaying && (
              <View style={styles.eqRow}>
                <Animated.View style={[styles.eqBar, { backgroundColor: currentColors.gold, transform: [{ scaleY: bar1 }] }]} />
                <Animated.View style={[styles.eqBar, { backgroundColor: currentColors.gold, transform: [{ scaleY: bar2 }] }]} />
                <Animated.View style={[styles.eqBar, { backgroundColor: currentColors.gold, transform: [{ scaleY: bar3 }] }]} />
                <Animated.View style={[styles.eqBar, { backgroundColor: currentColors.gold, transform: [{ scaleY: bar4 }] }]} />
              </View>
            )}
          </View>
        </View>

        <Pressable
          style={[styles.playBtn, { backgroundColor: currentColors.gold }]}
          onPress={handleTogglePlay}
          accessibilityLabel={isPlaying ? t("chants.pause") : t("chants.play")}
        >
          <Text style={styles.playBtnText}>{isPlaying ? "⏸" : "▶"}</Text>
        </Pressable>
      </View>

      {/* Track Selector Chips */}
      <View style={styles.trackChipsRow}>
        {CHANT_TRACKS.map((track, idx) => {
          const isSelected = idx === activeTrackIndex;
          return (
            <Pressable
              key={track.id}
              onPress={() => {
                setActiveTrackIndex(idx);
                setIsPlaying(true);
              }}
              style={[
                styles.chip,
                {
                  borderColor: isSelected ? currentColors.gold : currentColors.cardBorder,
                  backgroundColor: isSelected ? currentColors.goldGlow : currentColors.surface
                }
              ]}
            >
              <Text style={styles.chipIcon}>{track.icon}</Text>
              <Text
                style={[
                  styles.chipText,
                  { color: isSelected ? currentColors.gold : currentColors.muted },
                  isSelected && { fontWeight: "700" }
                ]}
                numberOfLines={1}
              >
                {track.id === "da_bei_zhou" ? "大悲咒" : track.id === "heart_sutra" ? "心经" : "菩提曲"}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Complete Meditation Session Button */}
      <Pressable
        style={[styles.completeBtn, { backgroundColor: currentColors.jade }]}
        onPress={handleComplete}
      >
        <Text style={styles.completeBtnText}>
          {t("chants.completeBtn")}
        </Text>
      </Pressable>

      {completeToast && (
        <View style={[styles.toastCard, { backgroundColor: currentColors.surfaceStrong, borderColor: currentColors.jade }]}>
          <Text style={[styles.toastText, { color: currentColors.jade }]}>{completeToast}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: layout.spacing.md,
    gap: layout.spacing.sm
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  flexOne: {
    flex: 1
  },
  eyebrow: {
    fontSize: typography.sizes.eyebrow,
    textTransform: "uppercase",
    letterSpacing: 0.8
  },
  title: {
    fontSize: typography.sizes.title,
    fontWeight: "700"
  },
  lotusIcon: {
    fontSize: 28
  },
  copy: {
    fontSize: typography.sizes.caption,
    lineHeight: 18
  },
  trackHero: {
    flexDirection: "row",
    alignItems: "center",
    padding: layout.spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    gap: layout.spacing.sm
  },
  trackIcon: {
    fontSize: 24
  },
  trackName: {
    fontSize: typography.sizes.body,
    fontWeight: "700"
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600"
  },
  eqRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
    height: 12
  },
  eqBar: {
    width: 2.5,
    height: 12,
    borderRadius: 1
  },
  playBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center"
  },
  playBtnText: {
    fontSize: 16,
    color: "#1a1410",
    fontWeight: "700"
  },
  trackChipsRow: {
    flexDirection: "row",
    gap: layout.spacing.xs
  },
  chip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 10,
    borderWidth: 1,
    gap: 4
  },
  chipIcon: {
    fontSize: 14
  },
  chipText: {
    fontSize: 12
  },
  completeBtn: {
    minHeight: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4
  },
  completeBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14
  },
  toastCard: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 8,
    alignItems: "center"
  },
  toastText: {
    fontSize: 13,
    fontWeight: "600"
  }
});
