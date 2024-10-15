import { ThemedText } from "@/components/ThemedText";
import { useProfilePicContext, useUserNameContext } from "@/contexts/UserContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { View, StyleSheet, Pressable, ImageBackground } from "react-native";
import * as SMS from "expo-sms";

export default function Profile() {
    const bgColor = useThemeColor({}, "background");
    const primary = useThemeColor({}, "primary");

    const userName = useUserNameContext();
    const defaultProfilePic = require("@/assets/images/default-profile-pic.png");
    const profilePicLink = useProfilePicContext();

    const sendSMS = async () => {
        const smsAvailable = await SMS.isAvailableAsync();

        if (smsAvailable) {
            const { result } = await SMS.sendSMSAsync(
                ["1111111", "2222222", "3333333"],
                "New recordings available!"
            );
            console.log(result);
        } else {
            console.warn("No sms available for this device");
        }
    };

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
            <ThemedText type="subtitle" style={styles.userName}>
                {userName}
            </ThemedText>
            <Pressable style={[styles.sms__button, { backgroundColor: primary }]} onPress={sendSMS}>
                <ThemedText type="defaultSemiBold" style={{ color: bgColor }}>
                    Notify Students via SMS
                </ThemedText>
            </Pressable>
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

    sms__button: {
        marginTop: 100,
        paddingTop: 10,
        paddingBottom: 7,
        paddingRight: 30,
        paddingLeft: 30,
        borderRadius: 10,
    },
});
