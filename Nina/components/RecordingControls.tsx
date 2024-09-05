// components/RecordingControls.tsx
import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

interface RecordingControlsProps {
    recordings: string[];  // List of recordings
    onNewRecording: (uri: string) => void;  // Callback to update the parent component when a new recording is created
}

export default function RecordingControls({ recordings, onNewRecording }: RecordingControlsProps) {
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null);

    // Start Recording
    async function startRecording() {
        try {
            if (recording) {
                await recording.stopAndUnloadAsync();
            }
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== 'granted') {
                throw new Error('Permission not granted!');
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording: newRecording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(newRecording);
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    // Stop Recording
    async function stopRecording() {
        if (recording) {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            onNewRecording(uri!);  // Notify the parent about the new recording
            setRecording(null);
        }
    }

    // Play Recording
    async function playRecording(uri: string) {
        if (sound) {
            await sound.unloadAsync();  // Stop any playing sound
        }

        const { sound: newSound } = await Audio.Sound.createAsync({ uri });
        setSound(newSound);
        await newSound.playAsync();
    }

    return (
        <View>
            <Button title="Start Recording" onPress={startRecording} />
            <Button title="Stop Recording" onPress={stopRecording} disabled={!recording} />

            {/* Play/Delete Recordings */}
            {recordings.map((uri, index) => (
                <View key={index} style={styles.recordingContainer}>
                    <Button title="Play Recording" onPress={() => playRecording(uri)} />
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    recordingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});
