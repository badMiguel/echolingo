import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { DataType, useTiwiContext } from '@/contexts/TiwiContext';
import { useNavigation } from "expo-router";
import AudioPlayback from "@/components/audio/playback";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import { useCourseContext } from "@/contexts/CourseContext";
import * as FileSystem from 'expo-file-system';
import { Record } from "../(addRecording)/record";

const useColor = () => {
    return {
        bgColor: useThemeColor({}, 'background'),
        textColor: useThemeColor({}, 'text'),
        tint: useThemeColor({}, 'tint'),
        accent: useThemeColor({}, 'accent'),
    };
};

export default function Sentence() {
    const navigation = useNavigation();
    const current = useTiwiContext();
    const color = useColor();
    const { course } = useCourseContext();

    // change header title dynamically
    useEffect(() => {
        if (course !== 'unknown') {
            navigation.setOptions({
                title: course
            })
        }
    }, [navigation])

    return (
        <View style={[styles.mainView, { backgroundColor: color.bgColor }]}>
            {!current ? (
                <View>
                    <ThemedText>Congratulations! You have completed this course.</ThemedText>
                </View>
            ) : (
                <>
                    <Question current={current} />
                    <ThemedText type="defaultSemiBold">Make your own recording:</ThemedText>
                    <Record fromStudent={true} />
                    <View style={{ flex: 1 }} />
                </>
            )}
        </View>
    );
}

const Question: React.FC<{ current: DataType }> = ({ current }) => {
    return (
        <View style={styles.questionView}>
            {current.Tiwi &&
                <View>
                    <ThemedText type="defaultSemiBold">Tiwi:</ThemedText>
                    <ThemedText>{current.Tiwi}</ThemedText>
                </View>
            }

            {current['Gloss (tiwi)'] &&
                <View>
                    <ThemedText type="defaultSemiBold">Tiwi (Gloss):</ThemedText>
                    <ThemedText>{current['Gloss (tiwi)']}</ThemedText>
                </View>
            }

            {current.recording ?
                <View>
                    <ThemedText type="defaultSemiBold">Teachers Recording:</ThemedText>
                    <AudioPlayback uri={FileSystem.documentDirectory + current.recording} />
                </View>
                : <ThemedText type='defaultSemiBold' style={{ alignSelf: 'center' }}>No recording available yet</ThemedText>
            }

            {
                current.English &&
                <View>
                    <ThemedText type="defaultSemiBold">English:</ThemedText>
                    <ThemedText>{current.English}</ThemedText>
                </View>
            }

            {
                current['Gloss (english)'] &&
                <View>
                    <ThemedText type="defaultSemiBold">English (Gloss):</ThemedText>
                    <ThemedText>{current['Gloss (english)']}</ThemedText>
                </View>
            }
        </View >
    );
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        paddingLeft: 30,
        paddingRight: 30,
        justifyContent: 'space-around',
    },

    questionView: {
        flex: 2,
        justifyContent: 'space-evenly'
    },

    button__container: {
        marginTop: 5,
        paddingTop: 1,
        paddingBottom: 1,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 10,
        alignSelf: 'center',
    },
});
