import React, { useState } from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import useRecording from "@/hooks/recording/useRecording";

export default function Record() {
    const { startRecording, stopRecording, recording, uri } = useRecording();
    console.log(uri);
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
