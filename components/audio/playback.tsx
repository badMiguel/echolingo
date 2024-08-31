import useAudio from "@/hooks/recording/useAudio";
import Slider from "@react-native-community/slider";
import { SetStateAction, useEffect, useState } from "react";
import { Button, StyleSheet, View } from "react-native";

type URI = {
    uri: string | null | undefined;
}

type PlayButtonProps = {
    uri: URI;
    startSound: (uri: string, startPos: number | undefined) => Promise<void>;
    pausePlaySound: (playing: boolean) => void;
    status: boolean;
    playing: boolean;
    setPlaying: React.Dispatch<SetStateAction<boolean>>;
    onGoing: boolean;
    setOnGoing: React.Dispatch<SetStateAction<boolean>>;
}

type SliderProp = {
    uri: URI;
    startSound: (uri: string, startPos: number | undefined) => Promise<void>;
    progress: number;
    duration: number;
}


export default function AudioPlayback({ uri }: { uri: URI }) {
    const { startSound, pausePlaySound, status, progress, duration } = useAudio();
    const [playing, setPlaying] = useState<boolean>(false);
    const [onGoing, setOnGoing] = useState<boolean>(false);

    useEffect(() => {
        if (status) {
            setOnGoing(false);
            setPlaying(false);
        }
    }, [status])


    return (
        <View>
            <AudioSlider
                uri={uri}
                progress={progress}
                duration={duration}
                startSound={startSound}
            />
            <Button
                title='5-'
                onPress={() => { }}
            />

            <PlayButton
                uri={uri}
                startSound={startSound}
                pausePlaySound={pausePlaySound}
                status={status}
                playing={playing}
                setPlaying={setPlaying}
                onGoing={onGoing}
                setOnGoing={setOnGoing}
            />

            <Button
                title='5+'
                onPress={() => { }}
            />
        </View>
    );
}

const PlayButton: React.FC<PlayButtonProps> = ({
    uri, startSound, pausePlaySound, status, playing, setPlaying, onGoing, setOnGoing }) => {

    const startButton = () => {
        if (typeof uri === 'string') {
            startSound(uri, undefined);
        }

        setOnGoing(true);
        setPlaying(true)
    }

    const pausePlayButton = () => {
        pausePlaySound(playing);
        setPlaying(!playing);
    }

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

const AudioSlider: React.FC<SliderProp> = ({ uri, startSound, progress, duration }) => {
    // const [currentPos, setCurrentPos] = useState(0);
    const changePosition = (val: number) => {
        if (typeof uri === 'string') {
            startSound(uri, val);
        }
    }

    return (
        <Slider
            minimumValue={0}
            maximumValue={duration}
            value={progress}
            onValueChange={(val) => changePosition(val)}
        />
    );
}

const styles = StyleSheet.create({
})
