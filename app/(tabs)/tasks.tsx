import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

type CourseCardProps = {
    courseNum: number,
    courseName: string,
    courseImgSrc: any,
};

export default function Tasks() {
    return (
        <View style={styles.tasksContainer}>
            <UnfinishedCourse />
            <FinishedCourse />
        </View>
    )
}

function FinishedCourse() {
    return (
        <View style={styles.courseContainer}>
            <Text>Finished Courses</Text>
        </View>
    )
}

function UnfinishedCourse() {
    return (
        <View style={styles.courseContainer}>
            <Text>Unfinished Courses</Text>
            <CourseCard 
                courseNum={1} 
                courseName="Animals" 
                courseImgSrc={require('../../assets/images/map-of-australia-painting-in-the-aboriginal-style-vector-1035812.jpg')} />
        </View>
    )
}

function CourseCard({ courseNum, courseName, courseImgSrc }: CourseCardProps) {
    return (
        <View style={styles.courseCardContainer}>
            <View style={styles.courseCardLabelContainer}>
                <Text>Course {courseNum}</Text>
                <Text>{courseName}</Text>
            </View>
            <View style={styles.courseCardImageContainer}>
                <Image
                    style={styles.courseCardImage}
                    source={courseImgSrc} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    tasksContainer: {
        flexDirection: 'column',
        margin: 10,
        gap: 20,
    },

    courseContainer: {
        flexDirection: 'column',
        gap: 20,
    },

    courseCardContainer: {
        flexDirection: 'row',
        maxHeight: 150,
        borderRadius: 10,
        overflow: 'hidden',
    },

    courseCardLabelContainer: {
        flex: 1.5,
        padding: 10,
        backgroundColor: 'pink',
    },

    courseCardImageContainer: {
        flex: 2,
        overflow: 'hidden',
    },

    courseCardImage: {
        height: '100%',
        width: '100%',
        resizeMode: 'cover',
    }
})
