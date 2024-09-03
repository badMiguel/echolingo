import React, { useEffect, useState } from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import * as DocumentPicker from 'expo-document-picker'
import useCRUD, { SaveRecReturn } from "@/hooks/recording/useCRUD";
import { useLocalSearchParams } from "expo-router";
import AudioPlayback from "@/components/audio/playback";
import { useThemeColor } from "@/hooks/useThemeColor";

type OpenDocumentPickerProp = {
    saveRecording: (uri: string, id: number) => Promise<SaveRecReturn>
    currentID: number,
}

export default function Upload() {
    const bgColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const accent = useThemeColor({}, 'accent');

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
    };

    const saveUpload = async () => {
        let status;

        setSaving(true);
        const start = performance.now();
        if (uri) { status = await saveRecording(uri, id) }
        const end = performance.now();

        if (!status) {
            setSaving(false);
            throw new Error('Failed to save uploaded recording');
        }

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
            setIsSuccess(false);
        }, 3000);
    };


    useEffect(() => {
        useDocumentPicker();
    }, []);

    return (
        <View style={[styles.mainView, {backgroundColor: bgColor}]}>
            <AudioPlayback uri={uri} disabled={!uploaded} />
            <Button
                title={saving ? 'Saving' : 'Save'}
                onPress={() => saveUpload()}
                disabled={saving ? true : false} 
            />
            <Button
                title={isSuccess ? 'Upload Another' : 'Upload'}
                onPress={() => useDocumentPicker()}
                disabled={saving ? true : false} 
            />
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
    }
});
