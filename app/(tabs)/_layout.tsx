import { Tabs, useLocalSearchParams } from "expo-router";
import { TabBarIcon, UserIcon, ClipboardListIcon } from "@/components/navigation/TabBarIcon";

export default function RootLayout() {
    const params = useLocalSearchParams();
    const userType = Array.isArray(params.userType) ? params.userType[0] : params.userType;
    const userName = Array.isArray(params.userName) ? params.userName[0] : params.userName;

    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size, focused }) => (
                        <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="tasks"
                options={{
                    title: "Tasks",
                    tabBarIcon: ({ color }) => (
                        <ClipboardListIcon color={color} />
                    ),
                    href: userType === 'teacher' ? null : "/tasks"
                }}
            />
            <Tabs.Screen
                name="recordingList"
                options={{
                    title: "Recording List",
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'list' : 'list-sharp'} color={color} />
                    ),
                    href: userType === 'student' ? null : "/recordingList"
                }}
            />

            <Tabs.Screen
                name="addRecording"
                options={{
                    title: "Add Recording",
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'add' : 'add-sharp'} color={color} />
                    ),
                    href: userType === 'student' ? null : "/addRecording"
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color }) => (
                        <UserIcon color={color} />
                    )
                }}
            />
        </Tabs>
    );
}
