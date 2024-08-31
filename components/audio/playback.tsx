import useAudio from "@/hooks/recording/useAudio";
import Slider from "@react-native-community/slider";
import { useEffect, useState } from "react";
import { Button, StyleSheet, View } from "react-native";

type URI = {
    uri: string | null | undefined;
}

export default function AudioPlayback({ uri }: URI) {

    return (
        <View>
            <Slider />
            <View>
                <Button
                    title='5-'
                    onPress={() => { }}
                />

                <PlayButton uri={uri} />

                <Button
                    title='5+'
                    onPress={() => { }}
                />
            </View>
        </View>
    );
}

const PlayButton: React.FC<URI> = ({ uri }) => {
    const [playing, setPlaying] = useState<boolean>(false);
    const [onGoing, setOnGoing] = useState<boolean>(false);
    const { startSound, pausePlaySound, status } = useAudio();

    const startButton = () => {
        if (uri) {
            startSound(uri);
        }

        setOnGoing(true);
        setPlaying(true)
    }

    const pausePlayButton = () => {
        pausePlaySound(playing);
        setPlaying(!playing);
    }

    useEffect(() => {
        if (status) {
            setOnGoing(false);
            setPlaying(false);
        }
    }, [status])

    return (
        <Button
            title={playing
                ? "Pause"
                : "Play"
            }
            onPress={onGoing
                ? () => pausePlayButton()
                : () => startButton()
            }
        />
    )
}

const styles = StyleSheet.create({
})
