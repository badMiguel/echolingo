import { Button, StyleSheet, View } from "react-native";
import React from "react";
import { router, } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useUserNameContext } from "@/contexts/UserContext";

export default function Home() {
    const bgColor = useThemeColor({}, "background");
    const textColor = useThemeColor({}, "text");
    const accent = useThemeColor({}, "primary");
    const userName = useUserNameContext();

    const date = new Date();
    const hours = date.getHours();

    const greetings = (): string => {
        if (hours < 12) {
            return "Morning";
        } else if (hours < 18) {
            return "Afternoon";
        } else {
            return "Evening";
        }
    };

    return (
        <View style={[styles.mainView, { backgroundColor: bgColor }]}>
            <ThemedText style={{ color: textColor }} type="title">
                Good {greetings()}
            </ThemedText>
            <ThemedText style={{ color: textColor }} type="subtitle">
                Hello, {userName}
            </ThemedText>
            <Button
                title="Go back to user type"
                color={accent}
                onPress={() => router.navigate("..")}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
    },
});
