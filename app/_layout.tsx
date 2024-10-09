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
                    headerStyle: { backgroundColor: bgColor },
                    headerTintColor: textColor,
                }}
            >
                <Stack.Screen
                    name="(tabs)"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="index"
                    options={{
                        headerShown: true,
                        title: "Choose User Type",
                    }}
                />
            </Stack>
        </UserTypeProvider>
    );
}
