import React from "react";
import { Stack } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { UserTypeProvider } from "@/contexts/UserType";

export default function RootLayout() {
    const bgColor = useThemeColor({}, "background");
    const textColor = useThemeColor({}, "text");

    return (
        <UserTypeProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="index" />
            </Stack>
        </UserTypeProvider>
    );
}
