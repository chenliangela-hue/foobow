import { StatusBar } from "expo-status-bar";
import { useRouter, type Href } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View
} from "react-native";
import {
  CategoryId,
  TabId,
  categories,
  deeds,
  initialBlessings,
  mapSpots,
  moods
} from "./src/foobowData";

const tabs: { id: TabId; label: string; href: Href }[] = [
  { id: "today", label: "Today", href: "/" },
  { id: "map", label: "Map", href: "/map" },
  { id: "deeds", label: "Deeds", href: "/deeds" },
  { id: "community", label: "Community", href: "/community" },
  { id: "profile", label: "Profile", href: "/profile" }
];

export type FoobowAppProps = {
  initialTab?: TabId;
  routeMode?: boolean;
};

export default function App({ initialTab = "today", routeMode = false }: FoobowAppProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [selectedMood, setSelectedMood] = useState<(typeof moods)[number]>(moods[0]);
  const [selectedSpotId, setSelectedSpotId] = useState("east-lake");
  const [selectedDeedId, setSelectedDeedId] = useState("release-fish");
  const [karma, setKarma] = useState(68);
  const [streak, setStreak] = useState(7);
  const [journal, setJournal] = useState("");
  const [blessingInput, setBlessingInput] = useState("");
  const [blessings, setBlessings] = useState(initialBlessings);
  const [quietMode, setQuietMode] = useState(true);
  const [privateJournal, setPrivateJournal] = useState(true);

  const visibleSpots = useMemo(
    () => mapSpots.filter((spot) => activeCategory === "all" || spot.categoryId === activeCategory),
    [activeCategory]
  );
  const visibleDeeds = useMemo(
    () => deeds.filter((deed) => activeCategory === "all" || deed.categoryId === activeCategory),
    [activeCategory]
  );
  const selectedSpot = visibleSpots.find((spot) => spot.id === selectedSpotId) || visibleSpots[0] || mapSpots[0];
  const selectedDeed = visibleDeeds.find((deed) => deed.id === selectedDeedId) || visibleDeeds[0] || deeds[0];

  function chooseCategory(categoryId: CategoryId) {
    const nextSpots = mapSpots.filter((spot) => categoryId === "all" || spot.categoryId === categoryId);
    const nextDeeds = deeds.filter((deed) => categoryId === "all" || deed.categoryId === categoryId);
    setActiveCategory(categoryId);
    setSelectedSpotId(nextSpots[0]?.id || "east-lake");
    setSelectedDeedId(nextDeeds[0]?.id || "release-fish");
  }

  function completeDaily() {
    setKarma((value) => Math.min(100, value + 4));
    setStreak((value) => value + 1);
    setJournal((value) => value || "I completed one quiet deed and chose a lighter next step.");
  }

  function performRitual() {
    setKarma((value) => Math.min(100, value + selectedDeed.points));
  }

  function sendBlessing() {
    const message = blessingInput.trim();
    if (!message) return;
    setBlessings((items) => [message, ...items]);
    setBlessingInput("");
    setKarma((value) => Math.min(100, value + 2));
  }

  function selectTab(tab: (typeof tabs)[number]) {
    setActiveTab(tab.id);
    if (routeMode) {
      router.push(tab.href);
    }
  }

  return (
    <SafeAreaView style={styles.shell}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Virtual good karma map</Text>
          <Text style={styles.logo}>Foobow</Text>
        </View>
        <View style={styles.karmaRing}>
          <Text style={styles.karmaValue}>{karma}</Text>
          <Text style={styles.karmaLabel}>karma</Text>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        {activeTab === "today" && (
          <View>
            <View style={styles.hero}>
              <Text style={styles.eyebrow}>Today</Text>
              <Text style={styles.title}>Do one quiet good deed.</Text>
              <Text style={styles.body}>Check in, choose a small symbolic action, and leave the day a little lighter.</Text>
            </View>
            <View style={styles.panel}>
              <View style={styles.rowBetween}>
                <Text style={styles.sectionTitle}>How are you arriving?</Text>
                <Text style={styles.pill}>{streak} day streak</Text>
              </View>
              <View style={styles.grid}>
                {moods.map((mood) => (
                  <Pressable
                    key={mood.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected: selectedMood.id === mood.id }}
                    onPress={() => setSelectedMood(mood)}
                    style={[styles.choice, selectedMood.id === mood.id && styles.choiceActive]}
                  >
                    <Text style={styles.choiceText}>{mood.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <View style={styles.focusCard}>
              <Text style={styles.eyebrow}>Recommended deed</Text>
              <Text style={styles.sectionTitle}>{selectedMood.deed}</Text>
              <Text style={styles.body}>A symbolic action that keeps comfort separate from real-world claims.</Text>
              <Pressable style={styles.primaryButton} onPress={completeDaily}>
                <Text style={styles.primaryButtonText}>Complete deed</Text>
              </Pressable>
            </View>
            <View style={styles.panel}>
              <Text style={styles.sectionTitle}>Karma journal</Text>
              <TextInput
                multiline
                value={journal}
                onChangeText={setJournal}
                placeholder="Today I want to release one worry and do one kind thing."
                placeholderTextColor="#6b706b"
                style={styles.input}
              />
            </View>
          </View>
        )}

        {activeTab === "map" && (
          <View>
            <View style={styles.mapStage}>
              <Text style={styles.eyebrow}>World map</Text>
              <Text style={styles.title}>Explore places that need a little light.</Text>
              {visibleSpots.map((spot) => (
                <Pressable
                  key={spot.id}
                  accessibilityLabel={`${spot.name} good deed spot`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: selectedSpot.id === spot.id }}
                  onPress={() => setSelectedSpotId(spot.id)}
                  style={[styles.mapPin, { left: spot.x, top: spot.y }, selectedSpot.id === spot.id && styles.mapPinActive]}
                />
              ))}
            </View>
            <CategoryFilters activeCategory={activeCategory} onSelect={chooseCategory} />
            <View style={styles.panel}>
              <Text style={styles.eyebrow}>{selectedSpot.categoryLabel}</Text>
              <Text style={styles.sectionTitle}>{selectedSpot.name}</Text>
              <Text style={styles.body}>{selectedSpot.description}</Text>
            </View>
          </View>
        )}

        {activeTab === "deeds" && (
          <View>
            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.eyebrow}>Deed catalog</Text>
                <Text style={styles.title}>Small rituals, clear categories.</Text>
              </View>
              <Text style={styles.pill}>{visibleDeeds.length} shown</Text>
            </View>
            <CategoryFilters activeCategory={activeCategory} onSelect={chooseCategory} />
            {visibleDeeds.map((deed) => (
              <Pressable
                key={deed.id}
                accessibilityRole="button"
                accessibilityState={{ selected: selectedDeed.id === deed.id }}
                onPress={() => setSelectedDeedId(deed.id)}
                style={[styles.deedCard, selectedDeed.id === deed.id && styles.choiceActive]}
              >
                <Text style={styles.sectionTitle}>{deed.title}</Text>
                <Text style={styles.body}>{deed.description}</Text>
              </Pressable>
            ))}
            <View style={styles.focusCard}>
              <Text style={styles.eyebrow}>Ritual preview</Text>
              <Text style={styles.sectionTitle}>{selectedDeed.title}</Text>
              <Text style={styles.body}>{selectedDeed.description}</Text>
              <Pressable style={styles.primaryButton} onPress={performRitual}>
                <Text style={styles.primaryButtonText}>Perform ritual</Text>
              </Pressable>
            </View>
          </View>
        )}

        {activeTab === "community" && (
          <View>
            <Text style={styles.eyebrow}>Community</Text>
            <Text style={styles.title}>A low-pressure kindness wall.</Text>
            <TextInput
              multiline
              value={blessingInput}
              onChangeText={setBlessingInput}
              placeholder="May your road feel less heavy today."
              placeholderTextColor="#6b706b"
              style={styles.input}
            />
            <Pressable style={styles.primaryButton} onPress={sendBlessing}>
              <Text style={styles.primaryButtonText}>Send blessing</Text>
            </Pressable>
            {blessings.map((blessing, index) => (
              <View key={`${blessing}-${index}`} style={styles.blessingCard}>
                <Text style={styles.body}>{blessing}</Text>
                <View style={styles.inlineActions}>
                  <Text style={styles.linkText}>Bless</Text>
                  <Text style={styles.linkText}>Report</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === "profile" && (
          <View>
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>F</Text>
              </View>
              <View style={styles.profileCopy}>
                <Text style={styles.eyebrow}>Profile</Text>
                <Text style={styles.title}>Quiet Helper</Text>
                <Text style={styles.body}>Private journal on. Ranking visibility set to quiet mode.</Text>
              </View>
            </View>
            <View style={styles.statsRow}>
              <Stat value="42" label="deeds" />
              <Stat value="9" label="badges" />
              <Stat value="$18" label="donated" />
            </View>
            <View style={styles.panel}>
              <Text style={styles.sectionTitle}>Enterprise settings</Text>
              <Setting label="Private journal" value={privateJournal} onValueChange={setPrivateJournal} />
              <Setting label="Quiet rankings" value={quietMode} onValueChange={setQuietMode} />
              <Text style={styles.body}>Donation receipts enabled. Data export and deletion are required backend flows.</Text>
            </View>
            <View style={styles.donationPanel}>
              <Text style={styles.eyebrow}>Real impact option</Text>
              <Text style={styles.sectionTitle}>Support a verified cause</Text>
              <Text style={styles.body}>This donation supports real operating costs or partner campaigns. It does not buy luck, virtue, or guaranteed karma.</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <Pressable
            key={tab.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === tab.id }}
            onPress={() => selectTab(tab)}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>{tab.label}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

function CategoryFilters({ activeCategory, onSelect }: { activeCategory: CategoryId; onSelect: (categoryId: CategoryId) => void }) {
  return (
    <View style={styles.filters}>
      {categories.map((category) => (
        <Pressable
          key={category.id}
          accessibilityRole="button"
          accessibilityState={{ selected: activeCategory === category.id }}
          onPress={() => onSelect(category.id)}
          style={[styles.filterChip, activeCategory === category.id && styles.filterChipActive]}
        >
          <Text style={[styles.filterText, activeCategory === category.id && styles.filterTextActive]}>{category.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Setting({ label, value, onValueChange }: { label: string; value: boolean; onValueChange: (value: boolean) => void }) {
  return (
    <View style={styles.settingRow}>
      <Text style={styles.body}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

const colors = {
  bg: "#f6f1e8",
  surface: "#fffaf1",
  ink: "#23302f",
  muted: "#59605a",
  teal: "#0f6c64",
  blue: "#315f94",
  moss: "#6c7b38",
  coral: "#9d3f30",
  gold: "#9a741d",
  line: "rgba(35, 48, 47, 0.14)"
};

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: colors.bg
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  content: {
    flex: 1
  },
  contentInner: {
    padding: 16,
    paddingBottom: 96
  },
  eyebrow: {
    color: colors.teal,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 6
  },
  logo: {
    color: colors.ink,
    fontSize: 34,
    fontWeight: "900"
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 31
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 24
  },
  body: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22
  },
  hero: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.line
  },
  karmaRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 8,
    borderColor: colors.teal,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface
  },
  karmaValue: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: "900"
  },
  karmaLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "700"
  },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
    marginTop: 14,
    gap: 12
  },
  focusCard: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
    marginTop: 14,
    gap: 10
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12
  },
  pill: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    color: colors.muted,
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  choice: {
    width: "47%",
    minHeight: 54,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    justifyContent: "center",
    padding: 12,
    backgroundColor: "#fff"
  },
  choiceActive: {
    borderColor: colors.teal,
    borderWidth: 2
  },
  choiceText: {
    color: colors.ink,
    fontWeight: "800"
  },
  primaryButton: {
    minHeight: 48,
    backgroundColor: colors.ink,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16
  },
  primaryButtonText: {
    color: colors.surface,
    fontWeight: "900"
  },
  input: {
    minHeight: 88,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    color: colors.ink,
    backgroundColor: "#fff",
    padding: 12,
    textAlignVertical: "top"
  },
  mapStage: {
    minHeight: 430,
    borderRadius: 8,
    padding: 18,
    overflow: "hidden",
    backgroundColor: "#9fbec0"
  },
  mapPin: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 4,
    borderColor: colors.surface,
    backgroundColor: colors.blue
  },
  mapPinActive: {
    backgroundColor: colors.coral,
    transform: [{ scale: 1.2 }]
  },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
    marginBottom: 4
  },
  filterChip: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: colors.surface
  },
  filterChipActive: {
    backgroundColor: colors.ink
  },
  filterText: {
    color: colors.ink,
    fontWeight: "800"
  },
  filterTextActive: {
    color: colors.surface
  },
  deedCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    padding: 14,
    marginTop: 10,
    gap: 6
  },
  blessingCard: {
    backgroundColor: colors.surface,
    borderLeftWidth: 4,
    borderLeftColor: colors.gold,
    borderRadius: 8,
    padding: 14,
    marginTop: 10,
    gap: 10
  },
  inlineActions: {
    flexDirection: "row",
    gap: 16
  },
  linkText: {
    color: colors.teal,
    fontWeight: "800"
  },
  profileHeader: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.teal,
    alignItems: "center",
    justifyContent: "center"
  },
  avatarText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900"
  },
  profileCopy: {
    flex: 1
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14
  },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    padding: 12,
    alignItems: "center"
  },
  statValue: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: "900"
  },
  statLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700"
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  donationPanel: {
    marginTop: 14,
    backgroundColor: "#fff6dd",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(154, 116, 29, 0.25)",
    gap: 8
  },
  tabBar: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: "row",
    padding: 6,
    gap: 4
  },
  tab: {
    flex: 1,
    minHeight: 44,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center"
  },
  tabActive: {
    backgroundColor: colors.ink
  },
  tabText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: "800"
  },
  tabTextActive: {
    color: colors.surface
  }
});
