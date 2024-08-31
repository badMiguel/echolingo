import React, { useEffect, useState } from "react";
import { View, Button, StyleSheet, Modal, Text } from "react-native";
import useRecording from "@/hooks/recording/useRecording";
import AudioPlayback from "@/components/audio/playback";
import useCRUD from "@/hooks/recording/useCRUD";
import { useLocalSearchParams } from "expo-router";

export default function Record() {
    const [saveStatus, setSaveStatus] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(false);
    const [tempUri, setTempUri] = useState<string | undefined | null>();

    const { startRecording, stopRecording, recording, uri, haveRecording } = useRecording();
    const { save } = useCRUD();
    const { current } = useLocalSearchParams();

    const currentID: number = Array.isArray(current) ? parseInt(current[0]) : parseInt(current);
    console.log(currentID)

    useEffect(() => {
        setTempUri(uri);
    }, [uri])

    const saveRecording = async () => {
        if (typeof tempUri === 'string') {
            setTempUri(undefined);
            const status = await save(tempUri, currentID);
            console.log(status.filePath);

            setTempUri(status.filePath);
            setSaveStatus(status.status);
        }

        setShow(true);
        setTimeout(() => {
            setShow(false);
        }, 3000)

        setSaveStatus(false);
    }

    return (
        <View>
            <AudioPlayback uri={tempUri} />
            <Button
                disabled={tempUri ? undefined : true}
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
