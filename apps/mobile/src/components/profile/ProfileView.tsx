import { useState } from "react";
import { Modal, Pressable, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { clerkEnabled } from "../../auth/clerkConfig";
import { LocalePreference, localeNames, supportedLocales, useI18n } from "../../i18n/LocaleContext";
import { AccountCard } from "./AccountCard";
import { createDonation } from "../../services/apiClient";
import { layout, typography } from "../../theme/theme";
import { useThemeColors } from "../../theme/ThemeContext";

type ProfileViewProps = {
  quietMode: boolean;
  onToggleQuietMode: (value: boolean) => void;
  privateJournal: boolean;
  onTogglePrivateJournal: (value: boolean) => void;
  seniorMode: boolean;
  onToggleSeniorMode: (value: boolean) => void;
  karma: number;
  streak: number;
  deedsCount?: number;
  badgesCount?: number;
};

export function ProfileView({
  quietMode,
  onToggleQuietMode,
  privateJournal,
  onTogglePrivateJournal,
  seniorMode,
  onToggleSeniorMode,
  karma,
  streak,
  deedsCount = 42,
  badgesCount = 4
}: ProfileViewProps) {
  const currentColors = useThemeColors();
  const { t, preference, setPreference } = useI18n();
  const eyebrowColor = { color: currentColors.muted };
  const headingColor = { color: currentColors.ink };
  const bodyColor = { color: currentColors.muted };
  const panelTheme = { backgroundColor: currentColors.surface, borderColor: currentColors.line };

  const languageOptions: { value: LocalePreference; label: string }[] = [
    { value: "system", label: t("profile.languageSystem") },
    ...supportedLocales.map((code) => ({ value: code as LocalePreference, label: localeNames[code] }))
  ];

  const [selectedTier, setSelectedTier] = useState<"1" | "3" | "9">("3");
  const [selectedMethod, setSelectedMethod] = useState<"stripe" | "wechat" | "alipay">("stripe");
  const [dedicationText, setDedicationText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptVisible, setReceiptVisible] = useState(false);
  const [receiptData, setReceiptData] = useState<{ id: string; amount: string; dedication: string } | null>(null);

  const handleConfirmSupport = async () => {
    setIsSubmitting(true);
    try {
      await createDonation({
        campaign_id: "campaign_operating_support",
        amount: selectedTier,
        currency: "USD"
      });
    } catch {
      // Graceful offline fallback
    } finally {
      setIsSubmitting(false);
      setReceiptData({
        id: `#FOB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        amount: selectedTier,
        dedication: dedicationText.trim() || "Dedicated to all sentient beings (回向众生)"
      });
      setReceiptVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.eyebrow, eyebrowColor, seniorMode && { fontSize: typography.sizes.caption }]}>
        {t("profile.eyebrow")}
      </Text>
      <Text style={[styles.title, headingColor, seniorMode && { fontSize: typography.sizes.headerSenior }]}>
        {t("profile.title")}
      </Text>

      {clerkEnabled && <AccountCard seniorMode={seniorMode} />}

      <View style={[styles.panel, panelTheme]}>
        <Text style={[styles.sectionTitle, headingColor, seniorMode && { fontSize: typography.sizes.titleSenior }]}>
          {t("profile.statistics")}
        </Text>
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: currentColors.surfaceStrong }]}>
            <Text style={[styles.statValue, { color: currentColors.gold }, seniorMode && { fontSize: 28 }]}>{karma}</Text>
            <Text style={[styles.statLabel, bodyColor, seniorMode && { fontSize: typography.sizes.caption }]}>
              {t("profile.totalKarma")}
            </Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: currentColors.surfaceStrong }]}>
            <Text style={[styles.statValue, { color: currentColors.jade }, seniorMode && { fontSize: 28 }]}>{streak}</Text>
            <Text style={[styles.statLabel, bodyColor, seniorMode && { fontSize: typography.sizes.caption }]}>
              {t("profile.dayStreak")}
            </Text>
          </View>
        </View>
        <View style={[styles.statsRow, { marginTop: layout.spacing.sm }]}>
          <View style={[styles.statBox, { backgroundColor: currentColors.surfaceStrong }]}>
            <Text style={[styles.statValue, { color: currentColors.ink }, seniorMode && { fontSize: 28 }]}>{deedsCount}</Text>
            <Text style={[styles.statLabel, bodyColor, seniorMode && { fontSize: typography.sizes.caption }]}>
              {t("profile.deedsDone")}
            </Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: currentColors.surfaceStrong }]}>
            <Text style={[styles.statValue, { color: currentColors.coral }, seniorMode && { fontSize: 28 }]}>{badgesCount}</Text>
            <Text style={[styles.statLabel, bodyColor, seniorMode && { fontSize: typography.sizes.caption }]}>
              {t("profile.badgesUnlocked")}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.panel, panelTheme]}>
        <Text style={[styles.sectionTitle, headingColor, seniorMode && { fontSize: typography.sizes.titleSenior }]}>
          {t("profile.preferences")}
        </Text>

        <View style={styles.switchRow}>
          <View style={styles.flexOne}>
            <Text style={[styles.switchLabel, headingColor, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
              {t("profile.quietMode")}
            </Text>
            <Text style={[styles.body, bodyColor, seniorMode && { fontSize: typography.sizes.caption }]}>
              {t("profile.quietModeCopy")}
            </Text>
          </View>
          <Switch
            value={quietMode}
            onValueChange={onToggleQuietMode}
            trackColor={{ false: currentColors.line, true: currentColors.jade }}
          />
        </View>

        <View style={styles.switchRow}>
          <View style={styles.flexOne}>
            <Text style={[styles.switchLabel, headingColor, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
              {t("profile.privateJournal")}
            </Text>
            <Text style={[styles.body, bodyColor, seniorMode && { fontSize: typography.sizes.caption }]}>
              {t("profile.privateJournalCopy")}
            </Text>
          </View>
          <Switch
            value={privateJournal}
            onValueChange={onTogglePrivateJournal}
            trackColor={{ false: currentColors.line, true: currentColors.jade }}
          />
        </View>

        <View style={styles.switchRow}>
          <View style={styles.flexOne}>
            <Text style={[styles.switchLabel, headingColor, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
              {t("profile.seniorMode")}
            </Text>
            <Text style={[styles.body, bodyColor, seniorMode && { fontSize: typography.sizes.caption }]}>
              {t("profile.seniorModeCopy")}
            </Text>
          </View>
          <Switch
            value={seniorMode}
            onValueChange={onToggleSeniorMode}
            trackColor={{ false: currentColors.line, true: currentColors.jade }}
          />
        </View>

        <View style={styles.languageBlock}>
          <Text style={[styles.switchLabel, headingColor, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
            {t("profile.language")}
          </Text>
          <Text style={[styles.body, bodyColor, seniorMode && { fontSize: typography.sizes.caption }]}>
            {t("profile.languageCopy")}
          </Text>
          <View style={styles.languageRow}>
            {languageOptions.map((option) => {
              const isActive = preference === option.value;
              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                  onPress={() => setPreference(option.value)}
                  style={[
                    styles.languageChip,
                    {
                      backgroundColor: isActive ? currentColors.jade : currentColors.surfaceStrong,
                      borderColor: isActive ? currentColors.jade : currentColors.line
                    }
                  ]}
                >
                  <Text
                    style={[
                      styles.languageChipText,
                      { color: isActive ? currentColors.surfaceStrong : currentColors.ink },
                      seniorMode && { fontSize: typography.sizes.body }
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>

      {/* Ethical Support & Voluntary Offerings Panel */}
      <View style={[styles.panel, panelTheme]}>
        <View style={styles.supportHeader}>
          <Text style={[styles.supportEyebrow, { color: currentColors.gold }]}>
            随喜助印 · 护持净土
          </Text>
          <View style={[styles.zeroKarmaBadge, { backgroundColor: currentColors.surfaceStrong, borderColor: currentColors.gold }]}>
            <Text style={[styles.zeroKarmaText, { color: currentColors.gold }]}>
              ⚖️ 0 Karma · Pure Giving
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, headingColor, seniorMode && { fontSize: typography.sizes.titleSenior }]}>
          Voluntary Operating Support
        </Text>

        <Text style={[styles.body, bodyColor, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
          This voluntary offering funds server infrastructure, OpenStreetMap tile hosting, and open-source maintenance. Decoupled from karma: 0 karma points awarded.
        </Text>

        {/* Preset Tiers */}
        <View style={styles.tierRow}>
          {(["1", "3", "9"] as const).map((amt) => {
            const isSelected = selectedTier === amt;
            return (
              <Pressable
                key={amt}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => setSelectedTier(amt)}
                style={[
                  styles.tierButton,
                  {
                    backgroundColor: isSelected ? currentColors.goldGlow : currentColors.surfaceStrong,
                    borderColor: isSelected ? currentColors.gold : currentColors.line
                  }
                ]}
              >
                <Text style={[styles.tierAmount, { color: isSelected ? currentColors.gold : currentColors.ink }]}>
                  ${amt}
                </Text>
                <Text style={[styles.tierLabel, { color: currentColors.muted }]}>
                  {amt === "1" ? "Tea Offering" : amt === "3" ? "Lamp Light" : "Incense Care"}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Payment Methods */}
        <Text style={[styles.fieldTitle, headingColor, seniorMode && { fontSize: typography.sizes.caption }]}>
          Payment Method (Test Mode):
        </Text>
        <View style={styles.methodRow}>
          {(
            [
              { id: "stripe" as const, label: "💳 Stripe Test" },
              { id: "wechat" as const, label: "🟢 WeChat Pay" },
              { id: "alipay" as const, label: "🔵 Alipay" }
            ]
          ).map((m) => {
            const isSelected = selectedMethod === m.id;
            return (
              <Pressable
                key={m.id}
                accessibilityRole="button"
                onPress={() => setSelectedMethod(m.id)}
                style={[
                  styles.methodChip,
                  {
                    backgroundColor: isSelected ? currentColors.surfaceStrong : currentColors.surface,
                    borderColor: isSelected ? currentColors.jade : currentColors.line
                  }
                ]}
              >
                <Text style={[styles.methodChipText, { color: isSelected ? currentColors.jade : currentColors.ink }]}>
                  {m.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Dedication Input */}
        <Text style={[styles.fieldTitle, headingColor, seniorMode && { fontSize: typography.sizes.caption }]}>
          Optional Dedication (回向发愿):
        </Text>
        <TextInput
          value={dedicationText}
          onChangeText={setDedicationText}
          placeholder="e.g., Dedicated to family wellbeing and world peace"
          placeholderTextColor={currentColors.muted}
          style={[
            styles.textInput,
            {
              backgroundColor: currentColors.surfaceStrong,
              color: currentColors.ink,
              borderColor: currentColors.line
            }
          ]}
        />

        {/* Submit Support Action */}
        <Pressable
          accessibilityRole="button"
          onPress={handleConfirmSupport}
          disabled={isSubmitting}
          style={[styles.supportActionBtn, { backgroundColor: currentColors.gold }]}
        >
          <Text style={[styles.supportActionBtnText, { color: currentColors.surfaceStrong }]}>
            {isSubmitting ? "Processing..." : `Support $${selectedTier}.00 USD (Test Checkout)`}
          </Text>
        </Pressable>

        {/* Receipt Modal */}
        <Modal
          visible={receiptVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setReceiptVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={[styles.receiptModalCard, { backgroundColor: currentColors.surface, borderColor: currentColors.gold }]}>
              <Text style={styles.receiptSeal}>🪷</Text>
              <Text style={[styles.receiptTitle, headingColor]}>
                Voluntary Support Certificate
              </Text>
              <Text style={[styles.receiptSubtitle, { color: currentColors.gold }]}>
                随喜助印 · 功德回向
              </Text>
              <Text style={[styles.receiptCode, { color: currentColors.muted }]}>
                {receiptData?.id || "#FOB-2026-8888"}
              </Text>

              <View style={[styles.receiptDivider, { backgroundColor: currentColors.line }]} />

              <Text style={[styles.receiptDetailLine, headingColor]}>
                Campaign: Foobow Operating Support
              </Text>
              <Text style={[styles.receiptDetailLine, headingColor]}>
                Amount: ${receiptData?.amount || selectedTier}.00 USD ({selectedMethod.toUpperCase()})
              </Text>
              <Text style={[styles.receiptDedicationText, { color: currentColors.gold }]}>
                "{receiptData?.dedication || "Dedicated to all sentient beings (回向众生)"}"
              </Text>

              <View style={[styles.pureGivingBox, { backgroundColor: currentColors.surfaceStrong }]}>
                <Text style={[styles.pureGivingNotice, { color: currentColors.muted }]}>
                  ⚖️ Decoupled from karma: 0 karma points awarded. True virtue cannot be bought with money.
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                onPress={() => setReceiptVisible(false)}
                style={[styles.closeReceiptBtn, { borderColor: currentColors.gold }]}
              >
                <Text style={[styles.closeReceiptBtnText, { color: currentColors.gold }]}>
                  Close Certificate · 善哉随喜
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>

      <View style={[styles.panel, panelTheme]}>
        <Text style={[styles.sectionTitle, headingColor, seniorMode && { fontSize: typography.sizes.titleSenior }]}>
          {t("profile.dataControls")}
        </Text>
        <Pressable style={[styles.secondaryButton, { borderColor: currentColors.line }]}>
          <Text
            style={[
              styles.secondaryButtonText,
              headingColor,
              seniorMode && { fontSize: typography.sizes.bodySenior }
            ]}
          >
            {t("profile.exportBackup")}
          </Text>
        </Pressable>
      </View>
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
  body: {
    fontSize: typography.sizes.caption,
    lineHeight: 18
  },
  panel: {
    padding: layout.spacing.md,
    borderRadius: layout.borderRadius.lg,
    borderWidth: 1,
    gap: layout.spacing.sm
  },
  sectionTitle: {
    fontSize: typography.sizes.title,
    fontWeight: "700",
    fontFamily: typography.fontFamilySerif
  },
  statsRow: {
    flexDirection: "row",
    gap: layout.spacing.md
  },
  statBox: {
    flex: 1,
    padding: layout.spacing.sm,
    borderRadius: layout.borderRadius.md,
    alignItems: "center"
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700"
  },
  statLabel: {
    fontSize: 12,
    textTransform: "uppercase"
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: layout.spacing.xs
  },
  flexOne: {
    flex: 1,
    paddingRight: layout.spacing.sm
  },
  switchLabel: {
    fontSize: typography.sizes.body,
    fontWeight: "600"
  },
  languageBlock: {
    paddingVertical: layout.spacing.xs,
    gap: layout.spacing.xs
  },
  languageRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: layout.spacing.xs,
    marginTop: layout.spacing.xs
  },
  languageChip: {
    minHeight: layout.minTouchTarget,
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.xs,
    borderRadius: layout.borderRadius.full,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  languageChipText: {
    fontSize: typography.sizes.caption,
    fontWeight: "600"
  },
  secondaryButton: {
    minHeight: layout.minTouchTarget,
    paddingHorizontal: layout.spacing.md,
    borderRadius: layout.borderRadius.full,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  secondaryButtonText: {
    fontSize: typography.sizes.body,
    fontWeight: "600"
  },
  supportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  supportEyebrow: {
    fontSize: typography.sizes.eyebrow,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontWeight: "700"
  },
  zeroKarmaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: layout.borderRadius.full,
    borderWidth: 1
  },
  zeroKarmaText: {
    fontSize: 11,
    fontWeight: "700"
  },
  tierRow: {
    flexDirection: "row",
    gap: layout.spacing.xs,
    marginTop: layout.spacing.xs
  },
  tierButton: {
    flex: 1,
    paddingVertical: layout.spacing.sm,
    paddingHorizontal: layout.spacing.xs,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center"
  },
  tierAmount: {
    fontSize: 20,
    fontWeight: "700"
  },
  tierLabel: {
    fontSize: 11,
    marginTop: 2
  },
  fieldTitle: {
    fontSize: typography.sizes.caption,
    fontWeight: "600",
    marginTop: layout.spacing.xs
  },
  methodRow: {
    flexDirection: "row",
    gap: layout.spacing.xs,
    flexWrap: "wrap",
    marginTop: layout.spacing.xs
  },
  methodChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  methodChipText: {
    fontSize: 12,
    fontWeight: "600"
  },
  textInput: {
    borderWidth: 1,
    borderRadius: layout.borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: typography.sizes.body,
    marginTop: layout.spacing.xs
  },
  supportActionBtn: {
    minHeight: layout.minTouchTarget,
    borderRadius: layout.borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginTop: layout.spacing.sm,
    paddingHorizontal: layout.spacing.md
  },
  supportActionBtnText: {
    fontSize: typography.sizes.body,
    fontWeight: "700"
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
    padding: layout.spacing.md
  },
  receiptModalCard: {
    width: "100%",
    maxWidth: 380,
    borderRadius: layout.borderRadius.lg,
    borderWidth: 1.5,
    padding: layout.spacing.lg,
    alignItems: "center",
    gap: layout.spacing.xs
  },
  receiptSeal: {
    fontSize: 36
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: typography.fontFamilySerif,
    textAlign: "center"
  },
  receiptSubtitle: {
    fontSize: 13,
    fontWeight: "600"
  },
  receiptCode: {
    fontSize: 13,
    fontFamily: "monospace",
    marginTop: 2
  },
  receiptDivider: {
    width: "100%",
    height: 1,
    marginVertical: layout.spacing.xs
  },
  receiptDetailLine: {
    fontSize: 13,
    textAlign: "center"
  },
  receiptDedicationText: {
    fontSize: 13,
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: 4
  },
  pureGivingBox: {
    padding: layout.spacing.sm,
    borderRadius: layout.borderRadius.md,
    marginVertical: layout.spacing.xs,
    width: "100%"
  },
  pureGivingNotice: {
    fontSize: 11,
    textAlign: "center",
    lineHeight: 16
  },
  closeReceiptBtn: {
    minHeight: layout.minTouchTarget,
    borderWidth: 1.5,
    borderRadius: layout.borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: layout.spacing.lg,
    marginTop: layout.spacing.xs,
    width: "100%"
  },
  closeReceiptBtnText: {
    fontSize: typography.sizes.body,
    fontWeight: "700"
  }
});
