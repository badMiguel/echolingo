import { ThemedText } from "@/components/ThemedText";
import { useUserNameContext } from "@/contexts/UserContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";
import { View, StyleSheet, Text, Image, Pressable, Button } from "react-native";

export default function Profile() {
    const bgColor = useThemeColor({}, "background");
    const userName = useUserNameContext();
    const defaultProfilePic = require("@/assets/images/default-profile-pic.png");

    return (
        <View style={[styles.mainView, { backgroundColor: bgColor }]}>
            <View style={[styles.profilePic__container, {}]}>
                <Image source={defaultProfilePic} />
                <Pressable onPress={() => router.push({ pathname: "/camera" })}>
                    <ThemedText>Change Profile Picture</ThemedText>
                </Pressable>
                <ThemedText>{userName}</ThemedText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
    },

    profilePic__container: {},
});
