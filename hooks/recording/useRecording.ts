import { Audio } from "expo-av";
import { Recording } from "expo-av/build/Audio";
import { useState } from "react";

export default function useRecording() {
    const [recording, setRecording] = useState<Audio.Recording>();
    const [haveRecording, setHaveRecording] = useState<boolean>(false);
    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const [uri, setUri] = useState<string | null | undefined>(undefined);

    async function startRecording() {
        try {
            if (permissionResponse?.status !== "granted") {
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
            console.error("Failed to start recording", err);
        }
    }

    async function stopRecording(curr?: Recording) {
        if (curr) {
            await curr?.stopAndUnloadAsync();
        } else {
            await recording?.stopAndUnloadAsync();
        }
        setRecording(undefined);
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
        });

        const uri = recording?.getURI();
        setUri(uri);
        setHaveRecording(true);
    }

    return { startRecording, stopRecording, recording, uri, haveRecording };
}
