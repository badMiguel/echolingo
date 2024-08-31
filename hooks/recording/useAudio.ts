import { Audio } from "expo-av";
import { useEffect, useState } from "react";


export default function useAudio() {
    const [sound, setSound] = useState<Audio.Sound>();
    const [status, setStatus] = useState(false);

    const playSound = async (uri: string) => {

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

    return { playSound, status };
}
