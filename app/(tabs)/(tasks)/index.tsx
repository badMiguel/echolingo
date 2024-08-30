import { Button, Image, SectionList, StyleSheet, Text, View } from 'react-native'
import courseData from '@/data/json/course_data.json';
import React from 'react'
import images from '@/constants/images';
import { router } from 'expo-router';
import { useSetCourseContext } from './courseProvider';

type CourseCardProps = {
    courseNum: number,
    courseName: string,
    courseImgSrc: any,
};

export default function Tasks() {
    const unfinished = courseData.filter(item => !item.completed);
    const finished = courseData.filter(item => item.completed);

    const empty = (is_finished: boolean) => {
        return {
            courseNum: 0,
            courseName: '',
            img_link: '',
            completed: is_finished,
        }
    }

    const sections = [
        {
            title: "Unfinished Courses",
            data: unfinished.length > 0 ? unfinished : [empty(false)],
        },
        {
            title: "Finished Courses",
            data: finished.length > 0 ? finished : [empty(true)],
        },
    ]

    return (
        <SectionList
            sections={sections}
            keyExtractor={(item) => item.courseName}
            renderItem={({ item }) =>
                item.courseName === '' ? (
                    !item.completed ? (
                        <Text style={styles.emptySection}>Congratulations! You have finished courses currently available.</Text>
                    ) : (
                        <Text style={styles.emptySection}>You currently have not finished any course yet.</Text>
                    )
                ) : (
                    <CourseCard
                        courseNum={item.courseNum}
                        courseName={item.courseName}
                        courseImgSrc={images[item.courseName]}
                    />
                )
            }
            renderSectionHeader={({ section: { title } }) => (
                <Text style={styles.tasks__header}>{title}</Text>
            )}
            style={styles.tasks}
        />
    )
}

function CourseCard({ courseNum, courseName, courseImgSrc }: CourseCardProps) {
    const setCourse = useSetCourseContext();

    const goToCourse = (courseName: string) => {
        setCourse(courseName);
        router.push({
            pathname: '/course',
        })
    };

    return (
        <View style={styles.courseCard}>
            <View style={styles.courseCard__label}>
                <Text>Course {courseNum}</Text>
                <Text>{courseName}</Text>
                <Button
                    onPress={() => goToCourse(courseName)}
                    title='Start Now' />
            </View>
            <View style={styles.courseCard__imageContainer}>
                <Image
                    style={styles.courseCard__image}
                    source={courseImgSrc} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    tasks: {
        flexDirection: 'column',
        paddingRight: 20,
        paddingLeft: 20
    },

    tasks__header: {
        marginTop: 20,
        marginBottom: 30,
    },

    emptySection: {
        marginBottom: 30,
    },

    courseCard: {
        flexDirection: 'row',
        maxHeight: 170,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 20,
    },

    courseCard__label: {
        flex: 1.5,
        padding: 10,
        backgroundColor: 'pink',
    },

    courseCard__imageContainer: {
        flex: 2,
        overflow: 'hidden',
    },

    courseCard__image: {
        height: '100%',
        width: '100%',
        resizeMode: 'cover',
    },
})
