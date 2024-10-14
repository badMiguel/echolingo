import { View, Button, StyleSheet, Text } from "react-native";
import React, { createContext, useCallback, useEffect, useState } from "react";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useSetUserNameContext, useSetUserTypeContext } from "@/contexts/UserContext";
import { ThemedText, loadFont } from "@/components/ThemedText";
import * as SplashScreen from "expo-splash-screen";

export const UserTypeContext = createContext("");

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function Index() {
    const bgColor = useThemeColor({}, "background");
    const buttonColor = useThemeColor({}, "primary");
    const setUserType = useSetUserTypeContext();
    const setUserName = useSetUserNameContext();

    const [appReady, setAppReady] = useState<boolean>(false);

    useEffect(() => {
        async function font() {
            try {
                const startTime = performance.now();
                const status = await loadFont();
                const endTime = performance.now();

                const startUpTime = endTime - startTime;
                if (startUpTime < 2000 && status) {
                    await new Promise((resolve) => setTimeout(resolve, 2000 - startUpTime));
                }

                setAppReady(status);
            } catch (error) {
                console.warn("Failed to fetch fonts", error);
            }
        }

        font();
    }, []);

    const login = (type: string, name: string) => {
        // todo better error handling
        if (setUserType) {
            setUserType(type);
        }

        if (setUserName) {
            setUserName(name);
        }

        router.push({
            pathname: "/(tabs)",
        });
    };

    const onLayoutRootView = useCallback(async () => {
        if (appReady) {
            // hides splashscreen
            await SplashScreen.hideAsync();
        }
    }, [appReady]);

    if (!appReady) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: bgColor,
                }}
            >
                <Text style={{ fontWeight: 600, fontSize: 25 }}>Loading App...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.mainView, { backgroundColor: bgColor }]} onLayout={onLayoutRootView}>
            <ThemedText type="defaultSemiBold">Select User Type</ThemedText>
            <View style={styles.button__container}>
                <Button
                    color={buttonColor}
                    onPress={() => login("student", "Student Name")}
                    title="Student View"
                />
                <Button
                    color={buttonColor}
                    onPress={() => login("teacher", "Teacher Name")}
                    title="Teacher View"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 20,
    },

    button__container: {
        flexDirection: "row",
        gap: 20,
    },
});
