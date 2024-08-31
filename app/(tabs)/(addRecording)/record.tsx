import React, { useState } from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import useRecording from "@/hooks/recording/useRecording";
import useAudio from "@/hooks/recording/useAudio";

export default function Record() {
    const { startRecording, stopRecording, recording, uri, haveRecording } = useRecording();
    const { playSound } = useAudio();

    const playAudio = () => {
        if (uri) {
            const audio = playSound(uri);
        }
    }
    return (
        <View>
            <Button
                title={recording ? "Stop Recording" : "Start Recording"}
                onPress={recording ? stopRecording : startRecording}
            />
            {haveRecording &&
                <Button
                    title="Play Audio"
                    onPress={() => playAudio()}
                />
            }
        </View>
    );
}

const styles = StyleSheet.create({
});
