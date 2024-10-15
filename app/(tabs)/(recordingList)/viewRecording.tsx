import AudioPlayback from "@/components/audio/playback";
import { Entry, emptyTiwiData, useTiwiListContext } from "@/contexts/TiwiContext";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import useCRUD from "@/hooks/data/useCRUD";

export default function ViewRecording() {
    const bgColor = useThemeColor({}, "background");
    const primary = useThemeColor({}, "primary");
    const primary_tint = useThemeColor({}, "primary_tint");
    const textColor = useThemeColor({}, "text");

    const [tiwi, setTiwi] = useState<Entry>(emptyTiwiData());
    const [uri, setUri] = useState<string>();
    const [id, setId] = useState<string>("");
    const [status, setStatus] = useState<boolean>(true);
    const [didError, setDidError] = useState<boolean>(false);

    const { sentenceID } = useLocalSearchParams();
    const data = useTiwiListContext();
    const { saveDetails } = useCRUD();

    const checkResponse = async (link: string, dataId: string): Promise<void> => {
        const response = await fetch(link, { method: "HEAD" });

        if (response.ok) {
            setUri(link);
        } else {
            saveDetails(dataId, {
                recordingURI: null,
            });
            setStatus(false);
            setDidError(true);
            setUri(undefined);

            await new Promise((resolve) => setTimeout(resolve, 3000));
            setStatus(true);
        }
    };

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
                    checkResponse(tiwiData.recording, id);
                }
            }
        }
    }, []);

    return (
        <View style={[styles.mainView, { backgroundColor: bgColor }]}>
            <View style={[styles.recording__details]}>
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
                    <Pressable
                        style={[
                            styles.button__container,
                            { backgroundColor: uri && status ? primary : primary_tint },
                        ]}
                        onPress={() =>
                            router.push({
                                pathname: "/(addSentence)",
                                params: {
                                    sentenceID: id,
                                },
                            })
                        }
                        disabled={uri && status ? undefined : true}
                    >
                        <ThemedText
                            type="defaultSemiBold"
                            style={[{ color: uri && status ? bgColor : primary }]}
                        >
                            {uri && status ? "Edit" : didError ? "Edit" : "Loading"}
                        </ThemedText>
                    </Pressable>
                    <Pressable
                        style={[styles.button__container, { backgroundColor: primary }]}
                        onPress={() =>
                            router.navigate({
                                pathname: "/(recordingList)",
                                params: {
                                    sentenceID: id,
                                },
                            })
                        }
                    >
                        <ThemedText type="defaultSemiBold" style={[{ color: bgColor }]}>
                            Back
                        </ThemedText>
                    </Pressable>
                </View>
                <ThemedText>{status}</ThemedText>
            </View>
            <View style={[styles.notif__view, { opacity: status ? 0 : 1 }]}>
                <ThemedText
                    style={[
                        styles.notif__text,
                        { backgroundColor: primary_tint, color: textColor },
                    ]}
                >
                    Error. No recording found.
                </ThemedText>
            </View>
        </View>
    );
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

    recording__details: { flex: 2 },

    button__container: {
        marginBottom: 10,
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: "center",
        borderRadius: 10,
    },

    playbackButton__container: {
        marginTop: 50,
    },

    notif__view: {
        justifyContent: "flex-end",
        marginBottom: 20,
    },

    notif__text: {
        alignSelf: "flex-start",
        textAlign: "center",
        paddingTop: 7,
        paddingBottom: 7,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5,
        fontSize: 18,
    },
});
