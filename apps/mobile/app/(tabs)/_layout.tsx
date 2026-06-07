import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={() => null}>
      <Tabs.Screen name="index" options={{ title: "Today" }} />
      <Tabs.Screen name="map" options={{ title: "Map" }} />
      <Tabs.Screen name="deeds" options={{ title: "Deeds" }} />
      <Tabs.Screen name="community" options={{ title: "Community" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
