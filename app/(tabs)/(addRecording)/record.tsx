import React, { useEffect, useState } from "react";
import { View, Button, StyleSheet, Modal, Text } from "react-native";
import useRecording from "@/hooks/recording/useRecording";
import AudioPlayback from "@/components/audio/playback";
import useCRUD from "@/hooks/recording/useCRUD";
import { useLocalSearchParams } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import * as FileSystem from 'expo-file-system';

const color = () => {
    return {
    }
}

export default function Record() {
    const bgColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const accent = useThemeColor({}, 'accent');
    const tint = useThemeColor({}, 'tint');

    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(false);
    const [tempUri, setTempUri] = useState<string | undefined | null>();

    const { startRecording, stopRecording, recording, uri, haveRecording } = useRecording();
    const { save } = useCRUD();
    const { current } = useLocalSearchParams();

    const currentID: number = Array.isArray(current) ? parseInt(current[0]) : parseInt(current);

    useEffect(() => {
        setTempUri(uri);
        console.log('out', uri);
    }, [uri])

    const saveRecording = async () => {
        if (typeof tempUri === 'string') {
            console.log('in', uri);
            setTempUri(undefined);
            setIsLoading(true);

            const startTime = performance.now();
            const status = await save(tempUri, currentID);
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
            <Button
                disabled={!tempUri || isLoading ? true : undefined}
                title={isLoading ? 'Loading' : 'Save'}
                onPress={() => saveRecording()}
            />
            <Button
                title={recording
                    ? "Stop Recording"
                    : haveRecording ? "Record Another"
                        : "Start Recording"}
                onPress={recording ? stopRecording : startRecording}
                disabled={isLoading ? true : undefined}
            />
            <View style={[styles.modal__view, { opacity: show ? 1 : 0 }]} >
                <Text
                    style={[styles.modal__text, { backgroundColor: accent, color: textColor }]}>
                    {isSuccess
                        ? 'Recording successfully saved'
                        : 'Failed to save recording'
                    }
                </Text>
            </View>
        </View >
    );
}



const styles = StyleSheet.create({
    mainView: {
        flex: 1
    },

    modal__view: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 20,
        marginLeft: 30,
    },

    modal__text: {
        alignSelf: 'flex-start',
        textAlign: 'center',
        paddingTop: 7,
        paddingBottom: 7,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5
    }
});
