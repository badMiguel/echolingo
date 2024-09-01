import React, { useEffect } from "react";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import { DataType, useDharugContext } from '@/contexts/DharugContext';
import { router, useNavigation } from "expo-router";
import AudioPlayback from "@/components/audio/playback";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import { useCourseContext } from "@/contexts/CourseContext";

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
    const current = useDharugContext();
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

    const handleNext = () => {
        router.back();
    }

    return (
        <View style={[styles.mainView, { backgroundColor: color.bgColor }]}>
            {!current ? (
                <View>
                    <Text>Congratulations! You have completed this course.</Text>
                </View>
            ) : (
                <>
                    <Question current={current} />
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <View style={[styles.button__container, { backgroundColor: color.tint }]}>
                            <Pressable onPress={() => handleNext()}>
                                <ThemedText type='defaultSemiBold' style={{ color: color.bgColor }}>Back</ThemedText>
                            </Pressable>
                        </View>
                    </View>
                </>
            )}
        </View>
    );
}

const Question: React.FC<{ current: DataType }> = ({ current }) => {
    return (
        <View style={styles.questionView}>
            {current.Dharug &&
                <View>
                    <ThemedText type="defaultSemiBold">Dharug:</ThemedText>
                    <ThemedText>{current.Dharug}</ThemedText>
                </View>
            }

            {current['Dharug(Gloss)'] &&
                <View>
                    <ThemedText type="defaultSemiBold">Dharug (Gloss):</ThemedText>
                    <ThemedText>{current['Dharug(Gloss)']}</ThemedText>
                </View>
            }

            <View>
                {current.recording
                    ? <AudioPlayback uri={current.recording} />
                    : <ThemedText>No recording available yet</ThemedText>}
            </View>

            {current.English &&
                <View>
                    <ThemedText type="defaultSemiBold">English:</ThemedText>
                    <ThemedText>{current.English}</ThemedText>
                </View>
            }

            {current['Gloss (english)'] &&
                <View>
                    <ThemedText type="defaultSemiBold">English (Gloss):</ThemedText>
                    <ThemedText>{current['Gloss (english)']}</ThemedText>
                </View>
            }
        </View>
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
