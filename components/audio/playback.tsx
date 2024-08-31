import useAudio from "@/hooks/recording/useAudio";
import Slider from "@react-native-community/slider";
import { useEffect, useState } from "react";
import { Button, StyleSheet, View } from "react-native";

type AudioPlaybackProp = {
    uri: string | null | undefined;
}

export default function AudioPlayback({ uri }: AudioPlaybackProp) {
    const [playing, setPlaying] = useState<boolean>(false);
    const [finished, setFinished] = useState<boolean>(false);
    const { playSound, status } = useAudio();

    const playAudio = () => {
        console.log(status)
        if (uri) {
            setPlaying(true);
            const audio = playSound(uri);
        }
    }

    const pauseAudio = () => {
        setPlaying(false);
    }

    useEffect(() => {
        setFinished(status);
        console.log(status)
    }, [status])

    return (
        <View>
            <Slider />
            <View>
                <Button
                    title='5-'
                    onPress={() => { }}
                />

                <Button
                    title={playing && finished
                        ? 'Play'
                        : !playing && finished ? 'Pause'
                        : playing ? 'Pause'
                            : 'Play'
                    }
                    onPress={() => playing && finished
                        ? playAudio()
                        : !playing && finished ? playAudio()
                        : playing ? pauseAudio()
                        : playAudio()
                    }
                />

                <Button
                    title='5+'
                    onPress={() => { }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
})
