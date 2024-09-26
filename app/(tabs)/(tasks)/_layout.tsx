import { Stack } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";

const TasksLayout = () => {
    const bgColor = useThemeColor({}, "background");
    const textColor = useThemeColor({}, "text");

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
                name="index"
                options={{
                    title: "Tasks",
                }}
            />
            <Stack.Screen
                name="category"
                options={{
                    title: "Category",
                }}
            />
            <Stack.Screen
                name="sentence"
                options={{
                    title: "Category",
                }}
            />
        </Stack>
    );
};

export default TasksLayout;
