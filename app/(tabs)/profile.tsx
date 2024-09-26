import { StyleSheet, View } from "react-native";
import React from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";

const Profile = () => {
    const bgColor = useThemeColor({}, "background");

    return (
        <View style={[styles.mainView, { backgroundColor: bgColor }]}>
            <ThemedText type="title">Profile</ThemedText>
        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
