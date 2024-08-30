import { StyleSheet } from 'react-native'
import { Stack } from 'expo-router'
import { CourseProvider } from '@/contexts/CourseContext'
import { DharugProvider } from '@/contexts/DharugContext'

const TasksLayout = () => {
    return (
        <CourseProvider>
            <DharugProvider>
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
                    <Stack.Screen
                        name='sentence'
                        options={{
                            title: 'Course',
                        }}
                    />
                </Stack>
            </DharugProvider>
        </CourseProvider>
    )
}

export default TasksLayout
