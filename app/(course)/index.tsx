import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import dharugData from '../../data/json/dharug_list.json'
import courseData from '../../data/json/course_data.json'

function Course() {
    const param = useLocalSearchParams();
    let courseName: string = Array.isArray(param.courseName) ? param.courseName[0] : param.courseName;
    filterPhrases(courseName);
    return (
        <View>
        </View>
    )
}

function filterPhrases(courseName: string) {
    const selectedCourse = courseData.filter(course => course.courseName === courseName);
    const phrases = dharugData.filter(item => selectedCourse.some(course => course.topic.includes(item.Topic)));
}

export default Course

const styles = StyleSheet.create({})
