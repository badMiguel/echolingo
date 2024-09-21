import AudioPlayback from "@/components/audio/playback";
import { DataType, useTiwiListContext } from "@/contexts/TiwiContext";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import * as FileSystem from "expo-file-system";

const empty = (): DataType => {
    return {
        id: 0,
        English: null,
        "Gloss (english)": null,
        "Gloss (tiwi)": null,
        Tiwi: null,
        Topic: null,
        "Image Name (optional)": null,
        recording: null,
        completed: false
    }
}

export default function ViewRecording() {
    const [tiwi, setTiwi] = useState<DataType>(empty);
    const [uri, setUri] = useState<string>();
    const [id, setId] = useState<string>("");

    const { sentenceID } = useLocalSearchParams();
    const data = useTiwiListContext();

    useEffect(() => {
        if (data) {
            const id = Array.isArray(sentenceID) ? sentenceID[0] : sentenceID;
            const tiwiData = data.find(item => item.id === parseInt(id));

            setId(id);

            // todo error handle
            if (tiwiData) {
                setTiwi(tiwiData);

                if (tiwiData.recording) {
                    setUri(FileSystem.documentDirectory + tiwiData.recording);
                }
            }
        }
    }, [])

    return (
        <View>
            <Text>Tiwi</Text>
            <Text>{tiwi?.Tiwi}</Text>
            {tiwi?.["Gloss (tiwi)"] && (
                <>
                    <Text>Tiwi Gloss</Text>
                    <Text>{tiwi?.["Gloss (tiwi)"]}</Text>
                </>
            )}
            <Text>English</Text>
            <Text>{tiwi?.English}</Text>
            {tiwi?.["Gloss (english)"] && (
                <>
                    <Text>English Gloss</Text>
                    <Text>{tiwi?.English}</Text>
                </>
            )}
            <AudioPlayback uri={uri} />
            <Button
                title="Edit"
                onPress={() => router.push({
                    pathname: "/(addRecording)",
                    params: {
                        sentenceID: id,
                    }
                })}
            />
        </View>
    )
}
