import { View, Button, StyleSheet } from "react-native";
import React, { createContext } from "react";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";

export const UserTypeContext = createContext("");

export default function Index() {
    const bgColor = useThemeColor({}, "background");
    const buttonColor = useThemeColor({}, "primary");

    const login = (type: string, name: string) => {
        router.push({
            pathname: "/(tabs)",
            params: {
                userType: type,
                userName: name,
            },
        });
    };

    return (
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
