import React from "react";
import { Stack } from "expo-router";
import { UserTypeProvider } from "@/contexts/UserType";

export default function RootLayout() {
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
