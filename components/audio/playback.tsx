import useAudio from "@/hooks/recording/useAudio";
import Slider from "@react-native-community/slider";
import React, { SetStateAction, useEffect, useState } from "react";
import { Button, StyleSheet, View } from "react-native";

export type URI = string | null | undefined;

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

type ForwardBackwardProp = {
    f_or_b: string;
    uri: URI;
    startSound: (uri: string, startPos: number | undefined) => Promise<void>;
    progress: number;
    duration: number;
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

            <ForwardBackward f_or_b="b" uri={uri} startSound={startSound} progress={progress} duration={duration} />

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

            <ForwardBackward f_or_b="f" uri={uri} startSound={startSound} progress={progress} duration={duration}/>

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
            disabled={uri ? undefined : true}
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

const ForwardBackward: React.FC<ForwardBackwardProp> = ({ f_or_b, uri, startSound, progress, duration }) => {
    const changePosition = () => {
        if (typeof uri === "string") {
            if (f_or_b === 'f') {
                const moveTo = duration < 5000 ? duration : progress + 5000
                startSound(uri, moveTo);
            } else {
                const moveTo = progress < 5000 ? 0 : progress - 5000
                startSound(uri, moveTo);
            }
        }
    }

    return (
        <Button
            disabled={uri ? undefined : true}
            title={f_or_b === 'f' ? '+5' : '-5'}
            onPress={() => changePosition()}
        />
    );
}

const AudioSlider: React.FC<SliderProp> = ({ uri, startSound, progress, duration }) => {
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
