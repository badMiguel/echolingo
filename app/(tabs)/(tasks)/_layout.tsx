import { StyleSheet } from 'react-native'
import { Stack } from 'expo-router'
import { CourseProvider } from './courseProvider'
import { DharugProvider } from './dharugProvider'

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

const styles = StyleSheet.create({})
