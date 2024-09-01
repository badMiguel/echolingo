import { DharugProvider } from "@/contexts/DharugContext";
import { Stack } from "expo-router";

export default function AddRecordingLayout() {
    return (
        <DharugProvider>
            <Stack>
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
        </DharugProvider>
    );
}
