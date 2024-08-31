import { Audio } from "expo-av";
import { useEffect, useState } from "react";

export default function useAudio(uri: string) {
    const [sound, setSound] = useState<Audio.Sound>();

    const playSound = async () => {
        const { sound } = await Audio.Sound.createAsync(require('@/assets/audio/Jazz.mp3'));
        setSound(sound);
        await sound.playAsync();
    }

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound])

    return { playSound };
}
