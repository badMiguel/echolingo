<<<<<<< HEAD
import { Stack, Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs>
      <Stack.Screen name="index" />
      <Stack.Screen name="about" />
    </Tabs>
  );
=======
import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" />
        </Stack>
    );
>>>>>>> 78cf467 (cleaning react native)
}
