import React, { useState } from "react";
import { View, Button, StyleSheet, Modal, Text } from "react-native";
import useRecording from "@/hooks/recording/useRecording";
import AudioPlayback from "@/components/audio/playback";
import useCRUD from "@/hooks/recording/useCRUD";
import { useLocalSearchParams } from "expo-router";

export default function Record() {
    const [saveStatus, setSaveStatus] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(false);

    const { startRecording, stopRecording, recording, uri, haveRecording } = useRecording();
    const { save } = useCRUD();
    const { current } = useLocalSearchParams();

    const currentID: number = Array.isArray(current) ? parseInt(current[0]) : parseInt(current);

    const saveRecording = async () => {
        if (typeof uri === 'string') {
            const status = await save(uri, currentID);
            setSaveStatus(status);
        } 

        setTimeout(() => {
            setShow(true)
        }, 3000)

        setSaveStatus(false);
    }

    return (
        <View>
            <AudioPlayback uri={uri} />
            <Button
                disabled={uri ? undefined : true}
                title="Save"
                onPress={() => saveRecording()}
            />
            <Button
                title={recording
                    ? "Stop Recording"
                    : haveRecording ? "Record Another"
                        : "Start Recording"}
                onPress={recording ? stopRecording : startRecording}
            />

            {show &&
                <Modal
                    animationType="fade"
                >
                    <Text>{saveStatus
                        ? 'Recording successfully saved'
                        : 'Failed to save recordign'}
                    </Text>
                </Modal>
            }
        </View>
    );
}



const styles = StyleSheet.create({
});
