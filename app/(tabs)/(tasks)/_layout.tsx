import { Stack } from 'expo-router'
import { useThemeColor } from '@/hooks/useThemeColor'

const TasksLayout = () => {
    const bgColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');

    return (
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
    )
}

export default TasksLayout
