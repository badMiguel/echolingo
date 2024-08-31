import React, { useState } from "react";
import { View, Button, StyleSheet } from "react-native";
import useRecording from "@/hooks/recording/useRecording";
import AudioPlayback from "@/components/audio/playback";

export default function Record() {
    const { startRecording, stopRecording, recording, uri, haveRecording } = useRecording();

    return (
        <View>
            {haveRecording &&
                <AudioPlayback uri={uri}/>
            }
            <Button
                title={recording 
                    ? "Stop Recording" 
                    : haveRecording ? "Record Another"
                    : "Start Recording"}
                onPress={recording ? stopRecording : startRecording}
            />
        </View>
    );
}

const styles = StyleSheet.create({
});
