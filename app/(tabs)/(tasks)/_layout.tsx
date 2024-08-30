import { StyleSheet, Text, View } from 'react-native'
import Tasks from '.'
import { Stack } from 'expo-router'

const TasksLayout = () => {
    return (
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
                    title: 'Course'
                }}
            />
        </Stack>
    )
}

export default TasksLayout

const styles = StyleSheet.create({})
