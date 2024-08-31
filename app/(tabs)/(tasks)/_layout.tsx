import { StyleSheet } from 'react-native'
import { Stack } from 'expo-router'
import { CourseProvider } from '@/contexts/CourseContext'
import { DharugProvider } from '@/contexts/DharugContext'
import { useThemeColor } from '@/hooks/useThemeColor'

const TasksLayout = () => {
    const bgColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');

    return (
        <CourseProvider>
            <DharugProvider>
                <Stack
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: bgColor,
                        },
                        headerTintColor: textColor,
                    }}
                >
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
