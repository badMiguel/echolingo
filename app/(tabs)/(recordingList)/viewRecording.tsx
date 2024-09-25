import AudioPlayback from "@/components/audio/playback";
import { Entry, emptyTiwiData, useTiwiListContext } from "@/contexts/TiwiContext";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import * as FileSystem from "expo-file-system";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";

export default function ViewRecording() {
    const [tiwi, setTiwi] = useState<Entry>(emptyTiwiData());
    const [uri, setUri] = useState<string>();
    const [id, setId] = useState<string>("");

    const { sentenceID } = useLocalSearchParams();
    const data = useTiwiListContext();
    const bgColor = useThemeColor({}, "background");
    const primary = useThemeColor({}, "primary");

    useEffect(() => {
        // todo error handling
        if (data) {
            const id = Array.isArray(sentenceID) ? sentenceID[0] : sentenceID;
            const tiwiData = data[id];

            setId(id);

            // todo error handle
            if (tiwiData) {
                setTiwi(tiwiData);

                if (tiwiData.recording) {
                    setUri(FileSystem.documentDirectory + tiwiData.recording);
                }
            }
        }
    }, [])

    return (
        <View style={[styles.mainView, { backgroundColor: bgColor }]}>
            <View style={styles.information}>
                <ThemedText type="defaultSemiBold">Tiwi</ThemedText>
                <ThemedText type="default">{tiwi?.Tiwi}</ThemedText>
                {tiwi?.["Gloss (tiwi)"] && (
                    <>
                        <ThemedText>Tiwi Gloss</ThemedText>
                        <ThemedText>{tiwi?.["Gloss (tiwi)"]}</ThemedText>
                    </>
                )}
                <ThemedText type="defaultSemiBold">English</ThemedText>
                <ThemedText type="default">{tiwi?.English}</ThemedText>
                {tiwi?.["Gloss (english)"] && (
                    <>
                        <ThemedText>English Gloss</ThemedText>
                        <ThemedText>{tiwi?.English}</ThemedText>
                    </>
                )}
            </View>
            <View style={styles.playbackButton__container}>
                <AudioPlayback uri={uri} />
                <View style={[styles.button__container, { backgroundColor: primary }]}>
                    <Pressable onPress={() => router.push({
                        pathname: "/(addRecording)",
                        params: {
                            sentenceID: id,
                        }
                    })}>
                        <ThemedText type="defaultSemiBold" style={[{ color: bgColor }]}>Edit</ThemedText>
                    </Pressable>
                </View>
                <View style={[styles.button__container, { backgroundColor: primary }]}>
                    <Pressable onPress={() => router.navigate({
                        pathname: "/(recordingList)",
                        params: {
                            sentenceID: id,
                        }
                    })}>
                        <ThemedText type="defaultSemiBold" style={[{ color: bgColor }]}>Back</ThemedText>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        paddingLeft: 30,
        paddingRight: 30,
    },

    information: {
        marginTop: 30,
        gap: 20,
    },

    button__container: {
        marginBottom: 10,
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center',
        borderRadius: 10,
    },

    playbackButton__container: {
        marginTop: 50,
    }
})
