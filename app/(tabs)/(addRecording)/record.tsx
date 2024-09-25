import React, { useEffect, useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import useRecording from "@/hooks/recording/useRecording";
import AudioPlayback from "@/components/audio/playback";
import useCRUD from "@/hooks/recording/useCRUD";
import { useLocalSearchParams } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";

export default function RecordView() {
    const bgColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const accent = useThemeColor({}, 'accent');

    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(false);

    const getShow = (show: boolean) => { setShow(show) }
    const getIsSuccess = (success: boolean) => { setIsSuccess(success) }

    return (
        <View style={[styles.mainView, { backgroundColor: bgColor }]}>
            <View style={styles.record}>
                <Record passShow={getShow} passIsSuccess={getIsSuccess} />
            </View>
            <View style={[styles.notif__view, { opacity: show ? 1 : 0 }]} >
                <ThemedText
                    style={[styles.notif__text, { backgroundColor: accent, color: textColor }]}>
                    {isSuccess
                        ? 'Recording successfully saved'
                        : 'Failed to save recording'
                    }
                </ThemedText>
            </View>
        </View>
    );
}

export function Record({ fromStudent, passShow, passIsSuccess }:
    { fromStudent?: boolean, passShow?: (show: boolean) => void, passIsSuccess?: (success: boolean) => void }) {
    const bgColor = useThemeColor({}, 'background');
    const primary = useThemeColor({}, 'primary');

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
    }, [uri]);

    useEffect(() => {
        if (passShow && passIsSuccess) {
            passShow(show);
            passIsSuccess(isSuccess);
        }
    }, [isSuccess, show]);

    useEffect(() => {
        if (!recording && isSuccess) { setIsSuccess(false) }
    }, [recording])

    const save = async () => {
        setIsSuccess(false);
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
        }, 3000)
    }

    return (
        <View>
            <AudioPlayback uri={tempUri} />
            {!fromStudent &&
                <Pressable
                    onPress={() => save()}
                    disabled={!tempUri || isLoading || isSuccess ? true : undefined}
                    style={[
                        styles.button,
                        { backgroundColor: !tempUri || isLoading || isSuccess ? primary : primary }
                    ]}
                >
                    <ThemedText type='defaultSemiBold' style={[
                        styles.button__text,
                        { color: !tempUri || isLoading || isSuccess ? primary : bgColor }
                    ]}>
                        {isLoading ? "Loading" : "Save"}
                    </ThemedText>
                </Pressable>
            }
            <Pressable
                onPress={recording ? stopRecording : startRecording}
                disabled={isLoading ? true : undefined}
                style={[
                    styles.button,
                    { backgroundColor: isLoading ? primary : primary }
                ]}
            >
                <ThemedText type='defaultSemiBold' style={[
                    styles.button__text,
                    { color: isLoading ? primary : bgColor }
                ]}>
                    {recording ? "Stop Recording"
                        : haveRecording ? "Record Another"
                            : "Start Recording"}
                </ThemedText>
            </Pressable>
        </View >
    );
}



const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        paddingLeft: 30,
        paddingRight: 30,
    },

    record: {
        flex: 2,
        justifyContent: 'center'
    },

    notif__view: {
        justifyContent: 'flex-end',
        marginBottom: 20,
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

    button: {
        alignItems: 'center',
        borderRadius: 10,
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 10
    },

    button__text: {
        paddingRight: 15,
        paddingLeft: 15,
        paddingTop: 2,
        paddingBottom: 2,
        borderRadius: 10,
    },
});
