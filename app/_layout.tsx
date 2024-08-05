import { Stack, Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs>
      <Stack.Screen name="index" />
      <Stack.Screen name="about" />
    </Tabs>
  );
}
