import { Pressable, StyleSheet, Text, View } from "react-native";
import { layout, typography } from "../../theme/theme";
import { useThemeColors } from "../../theme/ThemeContext";
import { TabId } from "../../types";

type TabOption = {
  id: TabId;
  label: string;
};

const tabs: TabOption[] = [
  { id: "today", label: "Today" },
  { id: "map", label: "Map" },
  { id: "deeds", label: "Deeds" },
  { id: "community", label: "Community" },
  { id: "profile", label: "Profile" }
];

type NavBarProps = {
  activeTab: TabId;
  onSelectTab: (tabId: TabId) => void;
  seniorMode?: boolean;
};

export function NavBar({ activeTab, onSelectTab, seniorMode }: NavBarProps) {
  const currentColors = useThemeColors();

  return (
    <View style={[styles.navBar, { backgroundColor: currentColors.surface, borderTopColor: currentColors.line }]}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <Pressable
            key={tab.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`${tab.label} tab`}
            onPress={() => onSelectTab(tab.id)}
            style={[
              styles.navItem,
              isActive && { backgroundColor: currentColors.bg }
            ]}
          >
            <Text
              style={[
                styles.navText,
                { color: isActive ? currentColors.jade : currentColors.muted },
                isActive && styles.navTextActive,
                seniorMode && { fontSize: typography.sizes.body }
              ]}
            >
              {tab.label}
            </Text>
            {isActive && <View style={[styles.activeDot, { backgroundColor: currentColors.jade }]} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    height: 64,
    borderTopWidth: 1,
    paddingHorizontal: layout.spacing.xs
  },
  navItem: {
    minWidth: layout.minTouchTarget,
    minHeight: layout.minTouchTarget,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: layout.spacing.xs,
    borderRadius: layout.borderRadius.md
  },
  navText: {
    fontSize: typography.sizes.caption,
    fontWeight: "500"
  },
  navTextActive: {
    fontWeight: "700"
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: layout.borderRadius.full,
    marginTop: 3
  }
});
