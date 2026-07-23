import { Pressable, StyleSheet, Text, View } from "react-native";
import { useI18n } from "../../i18n/LocaleContext";
import { layout, typography } from "../../theme/theme";
import { useThemeColors } from "../../theme/ThemeContext";
import { CategoryFilters } from "../common/CategoryFilters";
import { CalmRitualCard } from "./CalmRitualCard";
import { CategoryId, Deed } from "../../types";

type DeedCatalogViewProps = {
  activeCategory: CategoryId;
  onSelectCategory: (categoryId: CategoryId) => void;
  selectedDeed: Deed;
  onSelectDeed: (deedId: string) => void;
  visibleDeeds: Deed[];
  onPerformRitual: () => void;
  soundscape: string;
  onSelectSoundscape: (item: string) => void;
  focusReady: boolean;
  onStartFocus: () => void;
  onCompleteFocused: () => void;
  seniorMode?: boolean;
};

export function DeedCatalogView({
  activeCategory,
  onSelectCategory,
  selectedDeed,
  onSelectDeed,
  visibleDeeds,
  onPerformRitual,
  soundscape,
  onSelectSoundscape,
  focusReady,
  onStartFocus,
  onCompleteFocused,
  seniorMode
}: DeedCatalogViewProps) {
  const currentColors = useThemeColors();
  const { t } = useI18n();
  const eyebrowColor = { color: currentColors.muted };
  const headingColor = { color: currentColors.ink };
  const bodyColor = { color: currentColors.muted };

  return (
    <View style={styles.container}>
      <View style={styles.rowBetween}>
        <View>
          <Text style={[styles.eyebrow, eyebrowColor, seniorMode && { fontSize: typography.sizes.caption }]}>
            {t("deeds.eyebrow")}
          </Text>
          <Text style={[styles.title, headingColor, seniorMode && { fontSize: typography.sizes.headerSenior }]}>
            {t("deeds.title")}
          </Text>
        </View>
        <View style={[styles.pill, { backgroundColor: currentColors.surface, borderColor: currentColors.line }]}>
          <Text style={[styles.pillText, { color: currentColors.muted }]}>
            {t("deeds.shown", { count: visibleDeeds.length })}
          </Text>
        </View>
      </View>

      <CategoryFilters
        activeCategory={activeCategory}
        onSelect={onSelectCategory}
        seniorMode={seniorMode}
      />

      {visibleDeeds.map((deed) => {
        const isSelected = selectedDeed.id === deed.id;
        return (
          <Pressable
            key={deed.id}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onSelectDeed(deed.id)}
            style={[
              styles.deedCard,
              {
                backgroundColor: isSelected ? currentColors.surface : currentColors.surfaceStrong,
                borderColor: isSelected ? currentColors.jade : currentColors.line
              }
            ]}
          >
            <Text style={[styles.sectionTitle, headingColor, seniorMode && { fontSize: typography.sizes.titleSenior }]}>
              {deed.title}
            </Text>
            <Text style={[styles.body, bodyColor, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
              {deed.description}
            </Text>
          </Pressable>
        );
      })}

      <View style={[styles.focusCard, { backgroundColor: currentColors.surface, borderColor: currentColors.gold }]}>
        <Text style={[styles.eyebrow, eyebrowColor, seniorMode && { fontSize: typography.sizes.caption }]}>
          {t("deeds.ritualPreview")}
        </Text>
        <Text style={[styles.sectionTitle, headingColor, seniorMode && { fontSize: typography.sizes.titleSenior }]}>
          {selectedDeed.title}
        </Text>
        <Text style={[styles.body, bodyColor, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
          {selectedDeed.description}
        </Text>
        <Pressable
          style={[styles.primaryButton, { backgroundColor: currentColors.jade }]}
          onPress={onPerformRitual}
        >
          <Text style={[styles.primaryButtonText, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
            {t("deeds.performRitual")}
          </Text>
        </Pressable>
      </View>

      <CalmRitualCard
        soundscape={soundscape}
        onSelectSoundscape={onSelectSoundscape}
        focusReady={focusReady}
        onStartFocus={onStartFocus}
        onCompleteFocused={onCompleteFocused}
        seniorMode={seniorMode}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: layout.spacing.md
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
  title: {
    fontSize: typography.sizes.header,
    fontWeight: "700",
    fontFamily: typography.fontFamilySerif
  },
  body: {
    fontSize: typography.sizes.body,
    lineHeight: 22
  },
  sectionTitle: {
    fontSize: typography.sizes.title,
    fontWeight: "700",
    fontFamily: typography.fontFamilySerif
  },
  pill: {
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: 4,
    borderRadius: layout.borderRadius.full,
    borderWidth: 1
  },
  pillText: {
    fontSize: 12,
    fontWeight: "700"
  },
  deedCard: {
    padding: layout.spacing.md,
    borderRadius: layout.borderRadius.lg,
    borderWidth: 1,
    gap: layout.spacing.xs
  },
  focusCard: {
    padding: layout.spacing.md,
    borderRadius: layout.borderRadius.lg,
    borderWidth: 1.5,
    gap: layout.spacing.sm
  },
  primaryButton: {
    minHeight: layout.minTouchTarget,
    paddingHorizontal: layout.spacing.lg,
    paddingVertical: layout.spacing.sm,
    borderRadius: layout.borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginTop: layout.spacing.xs
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: typography.sizes.body,
    fontWeight: "700"
  }
});
