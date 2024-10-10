import { Audio } from "expo-av";
import { useEffect, useState } from "react";

export default function useAudio() {
    const [sound, setSound] = useState<Audio.Sound>();
    const [status, setStatus] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);

    const startSound = async (uri: string, startPos?: number) => {
        try {
            let initialStatus;

            // cleanup previous sound if exists
            if (sound) {
                setStatus(false);
                setProgress(0);
                await sound.unloadAsync();
            }

            if (startPos) {
                initialStatus = { shouldPlay: true, positionMillis: startPos };
            } else {
                initialStatus = { shouldPlay: true };
            }

            const { sound: playbackObject } = await Audio.Sound.createAsync(
                { uri: uri },
                initialStatus,
                onPlaybackStatusUpdate
            );

            setSound(playbackObject);
            await playbackObject.playAsync();
        } catch (err) {
            console.error("Error playing sound", err);
        }
    };

    const onPlaybackStatusUpdate = (status: any) => {
        if (status.didJustFinish) {
            setStatus(true);
        }

        setProgress(status.positionMillis);
        setDuration(status.durationMillis);
    };

    const nextRecording = async (uri: string) => {
        try {
            if (sound) {
                setStatus(false);
                setProgress(0);
                await sound.unloadAsync();
            }

            const { sound: playbackObject } = await Audio.Sound.createAsync(
                { uri: uri },
                { shouldPlay: true },
                onPlaybackStatusUpdate
            );

            setSound(playbackObject);
            await playbackObject.pauseAsync();
        } catch (err) {
            console.error("Error playing next recording", err);
        }
    };

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    return { startSound, status, progress, duration, nextRecording, sound };
}
