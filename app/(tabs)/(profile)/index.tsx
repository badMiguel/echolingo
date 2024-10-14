import { ThemedText } from "@/components/ThemedText";
import { useProfilePicContext, useUserNameContext } from "@/contexts/UserContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { View, StyleSheet, Text, Image, Pressable, Button, ImageBackground } from "react-native";

export default function Profile() {
    const bgColor = useThemeColor({}, "background");
    const userName = useUserNameContext();
    const defaultProfilePic = require("@/assets/images/default-profile-pic.png");
    const profilePicLink = useProfilePicContext();

    return (
        <View style={[styles.mainView, { backgroundColor: bgColor }]}>
            <ImageBackground
                style={styles.profilePic}
                source={profilePicLink ? { uri: profilePicLink } : defaultProfilePic}
            >
                <Pressable
                    style={styles.camera__button}
                    onPress={() => router.push({ pathname: "/camera" })}
                >
                    <Ionicons name="camera-sharp" size={30} color={"white"} />
                </Pressable>
            </ImageBackground>
            <ThemedText type="subtitle" style={styles.userName}>{userName}</ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        alignItems: "center",
    },

    camera__button: {
        backgroundColor: "grey",
        opacity: 0.9,
        alignSelf: "flex-end",
        padding: 5,
        borderRadius: 10,
        margin: 5,
    },

    profilePic: {
        height: 300,
        width: 300,
        resizeMode: "contain",
        justifyContent: "flex-end",
        marginTop: 30,
    },

    userName: {
        marginTop: 20,
    },
});
