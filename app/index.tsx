import { View, Button, StyleSheet, Text } from "react-native";
import React, { createContext, useEffect, useState } from "react";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { UserTypeProvider, useSetUserTypeContext } from "@/contexts/UserType";
import * as Font from "expo-font";

export const UserTypeContext = createContext("");

export default function Index() {
    const bgColor = useThemeColor({}, "background");
    const buttonColor = useThemeColor({}, "primary");
    const setUserType = useSetUserTypeContext();

    const [fontLoaded, setFontLoaded] = useState<boolean>(false);

    const loadFonts = async () => {
        await Font.loadAsync({
            "Poppins-ExtraBold": require("@/assets/fonts/Poppins-ExtraBold.ttf"),
            "Poppins-SemiBold": require("@/assets/fonts/Poppins-SemiBold.ttf"),
            "Poppins-Regular": require("@/assets/fonts/Poppins-Regular.ttf"),
            "Poppins-Medium": require("@/assets/fonts/Poppins-Medium.ttf"),
            "Poppins-Black": require("@/assets/fonts/Poppins-Black.ttf"),
            "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
        });

        setFontLoaded(true);
    };

    useEffect(() => {
        loadFonts();
    }, []);

    const login = (type: string, name: string) => {
        // todo better error handling
        if (setUserType) {
            setUserType(type);
        }
        router.push({
            pathname: "/(tabs)",
            params: {
                userName: name,
            },
        });
    };

    // todo add splash screen
    if (!fontLoaded) {
    }

    return (
        <UserTypeProvider>
            <View style={[styles.mainView, { backgroundColor: bgColor }]}>
                <Button
                    color={buttonColor}
                    onPress={() => login("student", "Student")}
                    title="Student View"
                />
                <Button
                    color={buttonColor}
                    onPress={() => login("teacher", "Teacher")}
                    title="Teacher View"
                />
            </View>
        </UserTypeProvider>
    );
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 20,
    },
});
