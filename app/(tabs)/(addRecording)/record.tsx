import React, { useEffect, useState } from "react";
import { View, Button, StyleSheet, Pressable } from "react-native";
import useRecording from "@/hooks/recording/useRecording";
import AudioPlayback from "@/components/audio/playback";
import useCRUD from "@/hooks/recording/useCRUD";
import { useLocalSearchParams } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";

export default function Record({ fromStudent }: { fromStudent?: boolean }) {
    const bgColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const accent = useThemeColor({}, 'accent');
    const tint = useThemeColor({}, 'tint');

    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(false);
    const [tempUri, setTempUri] = useState<string | undefined | null>();

    const { startRecording, stopRecording, recording, uri, haveRecording } = useRecording();
    const { saveRecording } = useCRUD();
    const { current } = useLocalSearchParams();

    const currentID: number = Array.isArray(current) ? parseInt(current[0]) : parseInt(current);

    useEffect(() => {
        setTempUri(uri);
    }, [uri])

    const save = async () => {
        if (typeof tempUri === 'string') {
            setTempUri(undefined);
            setIsLoading(true);

            const startTime = performance.now();
            const status = await saveRecording(tempUri, currentID);
            const endTime = performance.now();

            // avoid upload spam
            const uploadTime = endTime - startTime;
            if (uploadTime < 3000 && status.status) {
                await new Promise(resolve => setTimeout(resolve, 3000 - uploadTime));
            }

            setIsLoading(false);
            setTempUri(status.filePath);  // recording removed from original temp storage
            setIsSuccess(status.status);
        }

        setShow(true);
        setTimeout(() => {
            setShow(false);
            setIsSuccess(false);
        }, 3000)
    }

    return (
        <View style={styles.mainView}>
            <AudioPlayback uri={tempUri} />
            {!fromStudent &&
                <Button
                    disabled={!tempUri || isLoading ? true : undefined}
                    title={isLoading ? 'Loading' : 'Save'}
                    onPress={() => save()}
                />
            }
            <Pressable
                onPress={recording ? stopRecording : startRecording}
                disabled={isLoading ? true : undefined}
                style={[styles.recordButton,]}
            >
                <ThemedText style={[styles.recordButton__text, { color: bgColor, backgroundColor: tint }]}>
                    {recording ? "Stop Recording"
                        : haveRecording ? "Record Another"
                            : "Start Recording"}
                </ThemedText>
            </Pressable>
            <View style={[styles.notif__view, { opacity: show ? 1 : 0 }]} >
                <ThemedText
                    style={[styles.notif__text, { backgroundColor: accent, color: textColor }]}>
                    {isSuccess
                        ? 'Recording successfully saved'
                        : 'Failed to save recording'
                    }
                </ThemedText>
            </View>
        </View >
    );
}



const styles = StyleSheet.create({
    mainView: {
        flex: 1
    },

    notif__view: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 20,
        marginLeft: 30,
    },

    notif__text: {
        alignSelf: 'flex-start',
        textAlign: 'center',
        paddingTop: 7,
        paddingBottom: 7,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5
    },

    recordButton: {
        alignSelf: 'center',
    },

    recordButton__text: {
        paddingRight: 15,
        paddingLeft: 15,
        paddingTop: 2,
        paddingBottom: 2,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
});
