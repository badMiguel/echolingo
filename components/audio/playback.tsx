import useAudio from "@/hooks/recording/useAudio";
import Slider from "@react-native-community/slider";
import React, { SetStateAction, useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { TabBarIcon } from "../navigation/TabBarIcon";
import { useThemeColor } from "@/hooks/useThemeColor";

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
    setPlaying: React.Dispatch<SetStateAction<boolean>>;
}

const useColor = () => {
    return {
        bgColor: useThemeColor({}, 'background'),
        textColor: useThemeColor({}, 'text'),
        tint: useThemeColor({}, 'tint'),
        accent: useThemeColor({}, 'accent'),
        primary: useThemeColor({}, 'primary'),
    }
};

export default function AudioPlayback({ uri }: { uri: URI, disabled?: boolean }) {
    const { startSound, pausePlaySound, status, progress, duration } = useAudio();
    const [playing, setPlaying] = useState<boolean>(false);
    const [onGoing, setOnGoing] = useState<boolean>(false);
    const color = useColor();

    useEffect(() => {
        if (status) {
            setOnGoing(false);
            setPlaying(false);
        }
    }, [status])


    return (
        <View style={[styles.mainView, { backgroundColor: color.primary }]}>
            <AudioSlider
                uri={uri}
                progress={progress}
                duration={duration}
                startSound={startSound}
                setPlaying={setPlaying}
            />
            <View style={styles.playControls}>
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
                <ForwardBackward f_or_b="f" uri={uri} startSound={startSound} progress={progress} duration={duration} />
            </View>
        </View>
    );
}

const PlayButton: React.FC<PlayButtonProps> = ({
    uri, startSound, pausePlaySound, playing, setPlaying, onGoing, setOnGoing }) => {

    const color = useColor();

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
        <Pressable
            onPress={onGoing
                ? () => pausePlayButton()
                : () => startButton()
            }
            disabled={uri ? undefined : true}
        >
            <TabBarIcon color={uri ? color.accent : color.tint} size={50} name={playing ? "pause-circle-sharp" : "play-circle-sharp"} />
        </Pressable>
    )
}

const ForwardBackward: React.FC<ForwardBackwardProp> = ({ f_or_b, uri, startSound, progress, duration }) => {
    const color = useColor();
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
        <Pressable
            onPress={() => changePosition()}
            disabled={uri ? undefined : true}
        >
            <TabBarIcon color={uri ? color.accent : color.tint} size={30} name={f_or_b === 'f' ? 'play-skip-forward' : 'play-skip-back'} />
        </Pressable>
    );
}

const AudioSlider: React.FC<SliderProp> = ({ uri, startSound, progress, duration, setPlaying }) => {
    const [position, setPosition] = useState<number>();
    const color = useColor();

    useEffect(() => {
        setPosition(progress);
    }, [progress]);

    const changePosition = (val: number) => {
        setPosition(val)

        if (typeof uri === 'string') {
            setPlaying(true);
            startSound(uri, val);
        }
    };

    return (
        <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            onSlidingComplete={(val) => changePosition(val)}
            minimumTrackTintColor={color.accent}
            maximumTrackTintColor={color.tint}
            thumbTintColor={color.accent}
            disabled={uri ? false : true}
        />
    );
}

const styles = StyleSheet.create({
    mainView: {
        marginTop: 10,
        borderRadius: 20,
        marginBottom: 10,
    },

    playControls: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 40,
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 20,
    },

    slider: {
        paddingTop: 20,
        marginLeft: 20,
        marginRight: 20,
    },
})

