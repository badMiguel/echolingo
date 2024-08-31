import { Audio } from "expo-av";
import { useEffect, useState } from "react";

export default function useAudio() {
    const [sound, setSound] = useState<Audio.Sound>();
    const [status, setStatus] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);

    const startSound = async (uri: string, startPos?: number) => {
        let initialStatus;

        // cleanup previous sound if exists
        if (sound) {
            setStatus(false);
            setProgress(0);
            await sound.unloadAsync();
        }

        if (typeof startPos === 'number') {
            initialStatus = { shouldPlay: true, positionMillis: startPos }
        } else {
            initialStatus = { shouldPlay: true }
        }

        const { sound: playbackObject } = await Audio.Sound.createAsync(
            { uri: uri },
            initialStatus,
            onPlaybackStatusUpdate,
        );

        setSound(playbackObject);
        await playbackObject.playAsync();
    }

    const pausePlaySound = (playing: boolean) => {
        if (playing) {
            sound?.pauseAsync();
        } else {
            sound?.playAsync();
        }
    }

    const onPlaybackStatusUpdate = (status: any) => {
        if (status.didJustFinish) {
            setStatus(true);
        }

        setProgress(status.positionMillis);
        setDuration(status.durationMillis);
    }

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound])

    return { startSound, pausePlaySound, status, progress, duration };
}
