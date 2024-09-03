import React, { useEffect, useState } from "react";
import { Text, View, Button, StyleSheet, Pressable } from "react-native";
import * as DocumentPicker from 'expo-document-picker'
import useCRUD, { SaveRecReturn } from "@/hooks/recording/useCRUD";
import { useLocalSearchParams } from "expo-router";
import AudioPlayback from "@/components/audio/playback";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";

type OpenDocumentPickerProp = {
    saveRecording: (uri: string, id: number) => Promise<SaveRecReturn>
    currentID: number,
}

export default function Upload() {
    const bgColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const accent = useThemeColor({}, 'accent');
    const tint = useThemeColor({}, 'tint');

    const [uri, setUri] = useState<string | undefined>();
    const [uploaded, setUploaded] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);

    const { saveRecording } = useCRUD();

    const { current } = useLocalSearchParams();
    const id = Array.isArray(current) ? parseInt(current[0]) : parseInt(current);

    const useDocumentPicker = async () => {
        const uploadedUri = await openDocumentPicker({ saveRecording: saveRecording, currentID: id });
        setUri(uploadedUri);
        setUploaded(true);
        setIsSuccess(false);
    };

    const saveUpload = async () => {
        try {
            let status;

            setSaving(true);
            const start = performance.now();
            if (uri) { status = await saveRecording(uri, id) }
            const end = performance.now();

            if (!status?.status) {
                setSaving(false);
                throw new Error('Failed to save uploaded recording');
            }

            setUri(status.filePath);

            // delay to avoid spam upload
            const uploadTime = end - start;
            if (uploadTime < 3000) {
                await new Promise(resolve => setTimeout(resolve, 3000 - uploadTime));
            }

            setSaving(false);
            setIsSuccess(true);
            setShow(true);

            setTimeout(() => {
                setShow(false);
            }, 3000);

        } catch (err) {
            console.error('Upload Failed', err)

            setShow(true);
            setTimeout(() => {
                setShow(false);
            }, 3000);
        }
    };


    useEffect(() => {
        useDocumentPicker();
    }, []);

    return (
        <View style={[styles.mainView, { backgroundColor: bgColor }]}>
            <View style={styles.content}>
                <AudioPlayback uri={uri} disabled={!uploaded} />
                <Pressable
                    style={[
                        styles.button,
                        { backgroundColor: isSuccess || saving ? accent : tint }
                    ]}
                    onPress={() => saveUpload()}
                    disabled={isSuccess ? true : saving ? true : false}
                >
                    <ThemedText
                        type='defaultSemiBold'
                        style={{ color: isSuccess || saving ? tint : bgColor }}
                    >{saving ? 'Saving ...' : 'Save'}</ThemedText>
                </Pressable>
                <Pressable
                    style={[
                        styles.button,
                        { backgroundColor: saving ? accent : tint }
                    ]}
                    onPress={() => useDocumentPicker()}
                    disabled={saving ? true : false}
                >
                    <ThemedText
                        type='defaultSemiBold'
                        style={{ color: saving ? tint : bgColor }}
                    >{isSuccess ? 'Upload Another From Device' : 'Upload From Device'}</ThemedText>
                </Pressable>
            </View>
            <View style={[styles.notif__view, { opacity: show ? 1 : 0 }]} >
                <Text
                    style={[styles.notif__text, { backgroundColor: accent, color: textColor }]}>
                    {isSuccess
                        ? 'Recording successfully saved'
                        : 'Failed to save recording'
                    }
                </Text>
            </View>
        </View>
    );
}

async function openDocumentPicker({ saveRecording, currentID }: OpenDocumentPickerProp) {
    try {
        const result = await DocumentPicker.getDocumentAsync({
            type: '*/*',
            copyToCacheDirectory: true,
        });

        if (result.canceled) { throw new Error('Canceled by user'); }

        return result.assets[0].uri;
    } catch (err) {
        console.error('Failed opening document picker', err);
    }
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        paddingLeft: 30,
        paddingRight: 30,
        justifyContent: 'center',
    },

    content: {
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
        marginBottom: 10,
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
});
