import { Button, Image, Pressable, SectionList, StyleSheet, Text, View } from 'react-native'
import courseData from '@/data/json/course_data.json';
import React from 'react'
import images from '@/constants/images';
import { router } from 'expo-router';
import { useSetCourseContext } from '@/contexts/CourseContext';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

type CourseCardProps = {
    courseNum: number,
    courseName: string,
    courseImgSrc: any,
};

const colors = () => {
    return {
        bgColor: useThemeColor({}, 'background'),
        buttonColor: useThemeColor({}, 'tint'),
        textColor: useThemeColor({}, 'text'),
        accent: useThemeColor({}, 'accent'),
        tint: useThemeColor({}, 'tint'),
    }
}

export default function Tasks() {
    const color = colors();

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
        <View style={{ backgroundColor: color.bgColor }}>
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.courseName}
                renderItem={({ item }) =>
                    item.courseName === '' ? (
                        !item.completed ? (
                            <ThemedText type='default' style={[styles.emptySection, { color: color.textColor }]}>Congratulations! You have finished courses currently available.</ThemedText>
                        ) : (
                            <ThemedText type='default' style={[styles.emptySection, { color: color.textColor }]}>You currently have not finished any course yet.</ThemedText>
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
                    <ThemedText type='subtitle' style={[styles.tasks__header, { color: color.textColor }]}>{title}</ThemedText>
                )}
                style={styles.tasks}
            />
        </View>
    )
}

function CourseCard({ courseNum, courseName, courseImgSrc }: CourseCardProps) {
    const color = colors();
    const setCourse = useSetCourseContext();

    const goToCourse = (courseName: string) => {
        setCourse(courseName);
        router.push({
            pathname: '/course',
        })
    };

    return (
        <View style={[styles.courseCard, { backgroundColor: color.accent }]}>
            <View style={[styles.courseCard__label__container, { backgroundColor: color.accent }]}>
                <View style={styles.courseCard__label}>
                    <ThemedText type='subtitle'>Course {courseNum}</ThemedText>
                    <ThemedText>{courseName}</ThemedText>
                </View>
                <View style={styles.button__container}>
                    <Pressable
                        onPress={() => goToCourse(courseName)}
                        style={[
                            styles.button,
                            { backgroundColor: color.tint }
                        ]}>
                        <ThemedText type='defaultSemiBold' style={{ color: color.bgColor }}>Start Now</ThemedText>
                    </Pressable>
                </View>
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
        flex: 1,
    },

    courseCard__label__container: {
        flex: 1.5,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        justifyContent: 'space-around',
    },

    courseCard__imageContainer: {
        flex: 1.7,
        overflow: 'hidden',
    },

    courseCard__image: {
        height: '100%',
        width: '100%',
        resizeMode: 'cover',
    },

    button: {
        alignSelf: 'flex-start',
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 1,
        paddingTop: 1,
        borderRadius: 10,
        flexShrink: 1,
    },

    button__container: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'flex-end',
        margin: 10,
    }
})
