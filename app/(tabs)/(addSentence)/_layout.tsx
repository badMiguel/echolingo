import { useThemeColor } from "@/hooks/useThemeColor";
import { Stack } from "expo-router";

export default function AddRecordingLayout() {
    const bgColor = useThemeColor({}, "background");
    const textColor = useThemeColor({}, "text");

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: bgColor,
                },
                headerTintColor: textColor,
                headerTitleStyle: { fontFamily: "Poppins-SemiBold" },
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: "Add Sentence",
                }}
            />
            <Stack.Screen
                name="upload"
                options={{
                    title: "Upload",
                }}
            />
            <Stack.Screen
                name="recording"
                options={{
                    title: "Record",
                }}
            />
        </Stack>
    );
}
