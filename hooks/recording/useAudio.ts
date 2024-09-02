import { Audio } from "expo-av";
import { useEffect, useState } from "react";

export default function useAudio() {
    const [sound, setSound] = useState<Audio.Sound>();
    const [status, setStatus] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);

    const startSound = async (uri: string, startPos?: number) => {

        try {
            console.log(uri);
            let initialStatus;

            // cleanup previous sound if exists
            if (sound) {
                setStatus(false);
                setProgress(0);
                await sound.unloadAsync();
            }

            if (startPos) {
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
        } catch (err) {
            console.error('Error playing sound', err);
        }
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
