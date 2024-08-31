import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import Slider from '@react-native-community/slider'
import { DataType, useDharugContext } from '@/contexts/DharugContext';
import { router } from "expo-router";
import useAudio from "@/hooks/recording/useAudio";

type QuestionProp = {
    current: DataType;
}

type RecordingProp = {
    link: string;
}

export default function Sentence() {
    const current = useDharugContext();

    const handleNext = () => {
        router.back();
    }

    return (
        <View>
            {!current ? (
                <View>
                    <Text>Congratulations! You have completed this course.</Text>
                </View>
            ) : (
                <>
                    <Question current={current} />
                    <Button title='Back' onPress={() => handleNext()} />
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
    const { playSound } = useAudio('');

    const play = () => {
        playSound();
    }

    return (
        <View>
            <Slider />
            <View>
                <Button title='5-' onPress={() => { }} />
                <Button title='Play Sound' onPress={() => play()} />
                <Button title='5+' onPress={() => { }} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
});
