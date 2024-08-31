import { Audio } from "expo-av";
import { useState } from "react";

export default function useRecording() {
    const [recording, setRecording] = useState<Audio.Recording>();
    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const [uri, setUri] = useState<string | null | undefined>(undefined);

    async function startRecording() {
        try {
            if (permissionResponse?.status !== 'granted') {
                await requestPermission();
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );

            setRecording(recording);

        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    async function stopRecording() {
        setRecording(undefined);
        await recording?.stopAndUnloadAsync();
        await Audio.setAudioModeAsync(
            {
                allowsRecordingIOS: false,
            }
        );

        const uri = recording?.getURI();
        setUri(uri);

    }

    return { startRecording, stopRecording, recording, uri };

}
