import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useI18n } from "../../i18n/LocaleContext";
import { layout, typography } from "../../theme/theme";
import { useThemeColors } from "../../theme/ThemeContext";
import { deeds } from "../../services/foobowService";
import { Deed } from "../../types";

type CommunityViewProps = {
  blessingInput: string;
  onChangeBlessingInput: (text: string) => void;
  blessings: string[];
  onSendBlessing: () => void;
  seniorMode?: boolean;
};

export function CommunityView({
  blessingInput,
  onChangeBlessingInput,
  blessings,
  onSendBlessing,
  seniorMode
}: CommunityViewProps) {
  const currentColors = useThemeColors();
  const { t } = useI18n();

  const [mode, setMode] = useState<"share" | "ask">("share");
  const [selectedDeed, setSelectedDeed] = useState<Deed>(deeds[0]);
  const [urlError, setUrlError] = useState(false);

  const handlePost = () => {
    // Safety check: reject URLs/links to prevent phishing/spam
    if (/(https?:\/\/|www\.)/i.test(blessingInput)) {
      setUrlError(true);
      return;
    }
    setUrlError(false);

    if (mode === "share") {
      const cardText = selectedDeed
        ? `[${selectedDeed.title}] ${blessingInput.trim()}`
        : blessingInput.trim();
      onChangeBlessingInput(cardText);
    }
    onSendBlessing();
  };

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.eyebrow,
          { color: currentColors.muted },
          seniorMode && { fontSize: typography.sizes.caption }
        ]}
      >
        {t("community.eyebrow")}
      </Text>
      <Text
        style={[
          styles.title,
          { color: currentColors.ink },
          seniorMode && { fontSize: typography.sizes.headerSenior }
        ]}
      >
        {t("community.title")}
      </Text>

      {/* Mode Selector */}
      <View style={styles.modeRow}>
        <Pressable
          onPress={() => setMode("share")}
          style={[
            styles.modeButton,
            {
              backgroundColor: mode === "share" ? currentColors.jade : currentColors.surface,
              borderColor: mode === "share" ? currentColors.jade : currentColors.line
            }
          ]}
        >
          <Text
            style={[
              styles.modeButtonText,
              { color: mode === "share" ? currentColors.surfaceStrong : currentColors.ink }
            ]}
          >
            {t("community.modeShare")}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setMode("ask")}
          style={[
            styles.modeButton,
            {
              backgroundColor: mode === "ask" ? currentColors.jade : currentColors.surface,
              borderColor: mode === "ask" ? currentColors.jade : currentColors.line
            }
          ]}
        >
          <Text
            style={[
              styles.modeButtonText,
              { color: mode === "ask" ? currentColors.surfaceStrong : currentColors.ink }
            ]}
          >
            {t("community.modeAsk")}
          </Text>
        </Pressable>
      </View>

      {/* Deed Selection for Kindness Card Mode */}
      {mode === "share" && (
        <View style={[styles.deedSelectBox, { backgroundColor: currentColors.surface, borderColor: currentColors.cardBorder }]}>
          <Text style={[styles.subLabel, { color: currentColors.muted }]}>
            {t("community.selectDeed")}
          </Text>
          <View style={styles.deedChipsRow}>
            {deeds.slice(0, 6).map((deed) => {
              const isSelected = selectedDeed.id === deed.id;
              return (
                <Pressable
                  key={deed.id}
                  onPress={() => setSelectedDeed(deed)}
                  style={[
                    styles.deedChip,
                    {
                      backgroundColor: isSelected ? currentColors.goldGlow : currentColors.surfaceStrong,
                      borderColor: isSelected ? currentColors.gold : currentColors.line
                    }
                  ]}
                >
                  <Text
                    style={[
                      styles.deedChipText,
                      { color: isSelected ? currentColors.jade : currentColors.ink }
                    ]}
                  >
                    {deed.title}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {/* Input */}
      <TextInput
        multiline
        value={blessingInput}
        onChangeText={(txt) => {
          setUrlError(false);
          onChangeBlessingInput(txt);
        }}
        maxLength={140}
        placeholder={
          mode === "share"
            ? t("community.notePlaceholder")
            : t("community.askPlaceholder")
        }
        placeholderTextColor={currentColors.muted}
        style={[
          styles.input,
          {
            color: currentColors.ink,
            borderColor: urlError ? currentColors.coral : currentColors.line,
            backgroundColor: currentColors.surface
          }
        ]}
      />

      {urlError && (
        <Text style={[styles.errorText, { color: currentColors.coral }]}>
          Links and URLs are not permitted for community safety.
        </Text>
      )}

      <Pressable
        style={[styles.primaryButton, { backgroundColor: currentColors.jade }]}
        onPress={handlePost}
      >
        <Text style={[styles.primaryButtonText, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
          {t("community.sendBlessing")}
        </Text>
      </Pressable>

      {/* Wall of Kindness Cards & Reflections */}
      {blessings.map((blessing, index) => (
        <View
          key={`${blessing}-${index}`}
          style={[styles.blessingCard, { backgroundColor: currentColors.surface, borderColor: currentColors.cardBorder }]}
        >
          <Text
            style={[
              styles.body,
              { color: currentColors.ink },
              seniorMode && { fontSize: typography.sizes.bodySenior }
            ]}
          >
            {blessing}
          </Text>
          <View style={styles.inlineActions}>
            <Text style={[styles.linkText, { color: currentColors.jade }]}>{t("community.bless")}</Text>
            <Text style={[styles.linkText, { color: currentColors.muted }]}>{t("community.report")}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: layout.spacing.sm
  },
  eyebrow: {
    fontSize: typography.sizes.eyebrow,
    textTransform: "uppercase",
    letterSpacing: 0.8
  },
  title: {
    fontSize: typography.sizes.header,
    fontWeight: "700",
    fontFamily: typography.fontFamilySerif
  },
  modeRow: {
    flexDirection: "row",
    gap: layout.spacing.sm,
    marginVertical: layout.spacing.xs
  },
  modeButton: {
    flex: 1,
    minHeight: layout.minTouchTarget,
    borderRadius: layout.borderRadius.full,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: layout.spacing.md
  },
  modeButtonText: {
    fontSize: typography.sizes.body,
    fontWeight: "600"
  },
  deedSelectBox: {
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    padding: layout.spacing.sm,
    gap: layout.spacing.xs
  },
  subLabel: {
    fontSize: typography.sizes.caption,
    fontWeight: "600"
  },
  deedChipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: layout.spacing.xs
  },
  deedChip: {
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: 6,
    borderRadius: layout.borderRadius.sm,
    borderWidth: 1
  },
  deedChipText: {
    fontSize: typography.sizes.caption,
    fontWeight: "500"
  },
  body: {
    fontSize: typography.sizes.body,
    lineHeight: 22
  },
  input: {
    minHeight: 72,
    padding: layout.spacing.sm,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    fontSize: typography.sizes.body,
    textAlignVertical: "top"
  },
  errorText: {
    fontSize: typography.sizes.caption,
    fontWeight: "600"
  },
  primaryButton: {
    minHeight: layout.minTouchTarget,
    paddingHorizontal: layout.spacing.lg,
    paddingVertical: layout.spacing.sm,
    borderRadius: layout.borderRadius.full,
    alignItems: "center",
    justifyContent: "center"
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: typography.sizes.body,
    fontWeight: "700"
  },
  blessingCard: {
    padding: layout.spacing.md,
    borderRadius: layout.borderRadius.lg,
    borderWidth: 1,
    gap: layout.spacing.xs
  },
  inlineActions: {
    flexDirection: "row",
    gap: layout.spacing.md,
    marginTop: layout.spacing.xs
  },
  linkText: {
    fontSize: typography.sizes.caption,
    fontWeight: "600"
  }
});
