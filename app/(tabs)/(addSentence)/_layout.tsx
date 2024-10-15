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
                    title: "Add Recording",
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
