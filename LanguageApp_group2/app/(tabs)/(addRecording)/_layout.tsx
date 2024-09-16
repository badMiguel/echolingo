import { DharugProvider } from "@/contexts/DharugContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Stack } from "expo-router";

export default function AddRecordingLayout() {
    const bgColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: bgColor,
                },
                headerTintColor: textColor,
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: 'Add Recording'
                }}
            />
            <Stack.Screen
                name="upload"
                options={{
                    title: 'Upload'
                }}
            />
            <Stack.Screen
                name="record"
                options={{
                    title: 'Record'
                }}
            />
        </Stack>
    );
}
