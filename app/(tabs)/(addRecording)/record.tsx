import React, { useState } from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import { Audio } from "expo-av";

export default function Record() {
    const [recording, setRecording] = useState<Audio.Recording>();
    const [permissionResponse, requestPermission] = Audio.usePermissions();

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

    }

    return (
        <View>
            <Button
                title={recording ? "Stop Recording" : "Start Recording"}
                onPress={recording ? stopRecording : startRecording}
            />
        </View>
    );
}

const styles = StyleSheet.create({
});
