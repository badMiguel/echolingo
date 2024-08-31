import { Audio } from "expo-av";
import { useEffect, useState } from "react";


export default function useAudio() {
    const [sound, setSound] = useState<Audio.Sound>();
    const [status, setStatus] = useState(false);

    const startSound = async (uri: string) => {

        // cleanup previous sound if exists
        if (sound) {
            setStatus(false);
            await sound.unloadAsync();
        }

        const { sound: playbackObject } = await Audio.Sound.createAsync(
            { uri: uri },
            { shouldPlay: true },
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
    }

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound])

    return { startSound, pausePlaySound, status };
}
