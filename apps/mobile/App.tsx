import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, useColorScheme } from "react-native";
import { LocaleProvider } from "./src/i18n/LocaleContext";
import { storageKeys, usePersistentState } from "./src/services/storageService";
import { layout } from "./src/theme/theme";
import { ThemeProvider, useThemeColors } from "./src/theme/ThemeContext";
import { TabId } from "./src/types";

// Controllers
import { useTodayController } from "./src/controllers/useTodayController";
import { useMapController } from "./src/controllers/useMapController";
import { useDeedController } from "./src/controllers/useDeedController";
import { useCalmRitualController } from "./src/controllers/useCalmRitualController";
import { useCommunityController } from "./src/controllers/useCommunityController";
import { useProfileController } from "./src/controllers/useProfileController";

// Modular Views
import { Header } from "./src/components/common/Header";
import { NavBar } from "./src/components/common/NavBar";
import { TodayView } from "./src/components/today/TodayView";
import { MapView } from "./src/components/map/MapView";
import { DeedCatalogView } from "./src/components/deeds/DeedCatalogView";
import { CommunityView } from "./src/components/community/CommunityView";
import { ProfileView } from "./src/components/profile/ProfileView";

export type FoobowAppProps = {
  initialTab?: TabId;
  routeMode?: boolean;
};

export default function App(props: FoobowAppProps) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <FoobowShell {...props} />
      </LocaleProvider>
    </ThemeProvider>
  );
}

function FoobowShell({ initialTab = "today", routeMode = false }: FoobowAppProps) {
  const router = useRouter();
  const scheme = useColorScheme();
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);
  const [sharedKarma, setSharedKarma] = usePersistentState(storageKeys.karma, 68);

  const addKarma = (points: number) => {
    setSharedKarma((prev) => Math.min(100, prev + points));
  };

  // Controller Hooks
  const todayCtrl = useTodayController(addKarma);
  const mapCtrl = useMapController();
  const deedCtrl = useDeedController(addKarma);
  const calmRitualCtrl = useCalmRitualController(deedCtrl.selectedDeed, addKarma, (text) => todayCtrl.setJournal((prev) => prev || text));
  const communityCtrl = useCommunityController(addKarma);
  const profileCtrl = useProfileController();

  const handleSelectTab = (tabId: TabId) => {
    setActiveTab(tabId);
    if (routeMode) {
      const href = tabId === "today" ? "/" : `/${tabId}`;
      router.push(href as any);
    }
  };

  const currentColors = useThemeColors();

  return (
    <SafeAreaView style={[styles.shell, { backgroundColor: currentColors.bg }]}>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />

      <Header karma={sharedKarma} seniorMode={profileCtrl.seniorMode} />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        {activeTab === "today" && (
          <TodayView
            selectedMood={todayCtrl.selectedMood}
            onSelectMood={todayCtrl.setSelectedMood}
            streak={todayCtrl.streak}
            journal={todayCtrl.journal}
            onChangeJournal={todayCtrl.setJournal}
            onCompleteDaily={todayCtrl.completeDaily}
            seniorMode={profileCtrl.seniorMode}
            moods={todayCtrl.moods}
          />
        )}

        {activeTab === "map" && (
          <MapView
            activeCategory={mapCtrl.activeCategory}
            onSelectCategory={mapCtrl.chooseCategory}
            selectedSpot={mapCtrl.selectedSpot}
            onSelectSpot={mapCtrl.setSelectedSpotId}
            visibleSpots={mapCtrl.visibleSpots}
            seniorMode={profileCtrl.seniorMode}
          />
        )}

        {activeTab === "deeds" && (
          <DeedCatalogView
            activeCategory={deedCtrl.activeCategory}
            onSelectCategory={deedCtrl.chooseCategory}
            selectedDeed={deedCtrl.selectedDeed}
            onSelectDeed={deedCtrl.setSelectedDeedId}
            visibleDeeds={deedCtrl.visibleDeeds}
            onPerformRitual={deedCtrl.performRitual}
            soundscape={calmRitualCtrl.soundscape}
            onSelectSoundscape={calmRitualCtrl.setSoundscape}
            focusReady={calmRitualCtrl.focusReady}
            onStartFocus={calmRitualCtrl.startFocusSession}
            onCompleteFocused={calmRitualCtrl.completeFocusedRitual}
            seniorMode={profileCtrl.seniorMode}
          />
        )}

        {activeTab === "community" && (
          <CommunityView
            blessingInput={communityCtrl.blessingInput}
            onChangeBlessingInput={communityCtrl.setBlessingInput}
            blessings={communityCtrl.blessings}
            onSendBlessing={communityCtrl.sendBlessing}
            seniorMode={profileCtrl.seniorMode}
          />
        )}

        {activeTab === "profile" && (
          <ProfileView
            quietMode={profileCtrl.quietMode}
            onToggleQuietMode={profileCtrl.setQuietMode}
            privateJournal={profileCtrl.privateJournal}
            onTogglePrivateJournal={profileCtrl.setPrivateJournal}
            seniorMode={profileCtrl.seniorMode}
            onToggleSeniorMode={profileCtrl.setSeniorMode}
            karma={sharedKarma}
            streak={todayCtrl.streak}
          />
        )}
      </ScrollView>

      <NavBar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        seniorMode={profileCtrl.seniorMode}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1
  },
  content: {
    flex: 1
  },
  contentInner: {
    padding: layout.spacing.md,
    paddingBottom: layout.spacing.xl
  }
});
