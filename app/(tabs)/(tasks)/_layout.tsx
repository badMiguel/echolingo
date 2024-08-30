import { StyleSheet, Text, View } from 'react-native'
import Tasks from '.'
import { Stack, useNavigation } from 'expo-router'
import { CourseProvider, useCourseContext } from './courseProvider'
import { useEffect, useLayoutEffect, useState } from 'react'

const TasksLayout = () => {
    return (
        <CourseProvider>
            <Stack>
                <Stack.Screen
                    name='index'
                    options={{
                        title: 'Tasks',
                    }}
                />
                <Stack.Screen
                    name='course'
                    options={{
                        title: 'Course',
                    }}
                />
            </Stack>
        </CourseProvider>
    )
}

export default TasksLayout

const styles = StyleSheet.create({})
