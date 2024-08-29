import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';
import Slider from '@react-native-community/slider'
import currentDharug, { DharugDataType } from './currentDharug';
import { router } from 'expo-router';
import { useCourseContext } from './courseProvider';

type QuestionProp = {
    current: DharugDataType;
}

type RecordingProp = {
    link: string;
}

type CurrentState = DharugDataType | null;

export default function Course() {
    const [current, setCurrent] = useState<CurrentState>(null);
    const [dataLoaded, setAudioLoaded] = useState<Boolean>(false);
    const getCurrent = currentDharug();

    // initial load
    useEffect(() => {
        setCurrent(getCurrent);
        setAudioLoaded(true);
    }, [getCurrent]);

    useEffect(() => {
    }, []);

    const handleNext = (current: DharugDataType) => {
        router.push({
            pathname: '/courseGame'
        });
    };

    console.log(useCourseContext());

    return (
        <View>
            {!current ? (
                <View>
                    <Text>Congratulations! You have completed this course.</Text>
                </View>
            ) : (
                <>
                    {dataLoaded ? (
                        <>
                            <Question current={current} />
                            <Button title='Next' onPress={() => handleNext(current)} />
                        </>
                    ) : (
                        <Text>Loading Audio</Text>
                    )}
                </>
            )}
        </View>
    );
}

function Question({ current }: QuestionProp) {
    return (
        <View>
            {current.Dharug &&
                <>
                    <Text>Dharug:</Text>
                    <Text>{current.Dharug}</Text>
                </>
            }

            {current['Dharug(Gloss)'] &&
                <>
                    <Text>Dharug (Gloss):</Text>
                    <Text>{current['Dharug(Gloss)']}</Text>
                </>
            }

            {current.recording
                ? <Recording link={current.recording} />
                : <Text>No recording available yet</Text>
            }

            {current.English &&
                <>
                    <Text>English:</Text>
                    <Text>{current.English}</Text>
                </>
            }

            {current['Gloss (english)'] &&
                <>
                    <Text>English (Gloss):</Text>
                    <Text>{current['Gloss (english)']}</Text>
                </>
            }
        </View>
    );
}

function Recording({ link }: RecordingProp) {
    const [sound, setSound] = useState<Sound>();

    const playSound = async () => {
        const { sound } = await Audio.Sound.createAsync(require('../../assets/audio/Jazz.mp3'));
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

    return (
        <View>
            <Slider />
            <View>
                <Button title='5-' onPress={() => { }} />
                <Button title='Play Sound' onPress={playSound} />
                <Button title='5+' onPress={() => { }} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({})
