import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import dharugData from '../../data/json/dharug_list.json'
import courseData from '../../data/json/course_data.json'

type DharugDataType = {
    id: number;
    English: string | null;
    "Gloss (english)": string | null;
    "Dharug(Gloss)": string | null;
    Dharug: string | null;
    Topic: string | null;
    "Image Name (optional)": string | null;
    recording: string | null;
    completed: boolean;
};

type QuestionProp = {
    current: DharugDataType;
}

type RecordingProp = {
    link: string;
}

export default function Course() {
    const param = useLocalSearchParams();
    let courseName: string = Array.isArray(param.courseName)
        ? param.courseName[0] : param.courseName;

    const dharugList = filterDharug(courseName);
    const current: DharugDataType | null = dharugList.length > 0 ? dharugList[0] : null;

    return (
        <View>
            {!current ? (
                <View>
                    <Text>Congratulations! You have completed this course.</Text>
                </View>
            ) : (
                <Question current={current} />
            )}
        </View>
    )
}

function filterDharug(courseName: string): DharugDataType[] {
    const selectedCourse = courseData.filter(course => course.courseName === courseName);
    return dharugData.filter(item =>
        selectedCourse.some(course => course.topic.includes(item.Topic)) &&
        !item.completed
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

            {current.recording &&
                <Recording link={current.recording}/>
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
    return (
        <View>
        </View>
    );
}

const styles = StyleSheet.create({})
