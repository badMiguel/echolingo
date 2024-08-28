import { FlatList, Image, ScrollView, SectionList, StyleSheet, Text, View } from 'react-native'
import courseData from '../../data/json/course_data.json';
import React from 'react'
import images from '@/constants/images';

type CourseCardProps = {
    courseNum: number,
    courseName: string,
    courseImgSrc: any,
};

export default function Tasks() {
    const sections = [
        {
            title: "Finished Course",
            data: courseData.filter(item => item.completed === true),
        },
        {
            title: "Unfinished Course",
            data: courseData.filter(item => item.completed === false),
        },
    ]

    return (
        <SectionList
            sections={sections}
            keyExtractor={(item) => item.courseName}
            renderItem={({ item }) =>
                <CourseCard
                    courseNum={item.courseNum}
                    courseName={item.courseName}
                    courseImgSrc={images[item.courseName]}
                />
            }
            renderSectionHeader={({ section: { title } }) => (
                <Text style={styles.tasks__header}>{title}</Text>
            )}
            style={styles.tasks}
        />
    )
}

function CourseCard({ courseNum, courseName, courseImgSrc }: CourseCardProps) {
    return (
        <View style={styles.course__cardContainer}>
            <View style={styles.course__cardContainerLabel}>
                <Text>Course {courseNum}</Text>
                <Text>{courseName}</Text>
            </View>
            <View style={styles.course__cardImageContainer}>
                <Image
                    style={styles.course__cardImage}
                    source={courseImgSrc} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    tasks: {
        flexDirection: 'column',
        marginRight: 20,
        marginLeft: 20
    },

    tasks__header: {
        marginTop: 20,
        marginBottom: 30,
    },

    course: {
        flexDirection: 'column',
        gap: 20,
    },

    course__cardContainer: {
        flexDirection: 'row',
        maxHeight: 150,
        borderRadius: 10,
        overflow: 'hidden',
    },

    course__cardContainerLabel: {
        flex: 1.5,
        padding: 10,
        backgroundColor: 'pink',
    },

    course__cardImageContainer: {
        flex: 2,
        overflow: 'hidden',
    },

    course__cardImage: {
        height: '100%',
        width: '100%',
        resizeMode: 'cover',
    },
})
