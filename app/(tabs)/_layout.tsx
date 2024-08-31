import { Tabs, useLocalSearchParams } from "expo-router";
import { TabBarIcon, UserIcon, ClipboardListIcon } from "@/components/navigation/TabBarIcon";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function RootLayout() {
    const bgColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');

    const params = useLocalSearchParams();
    const userType = Array.isArray(params.userType) ? params.userType[0] : params.userType;
    const userName = Array.isArray(params.userName) ? params.userName[0] : params.userName;

    return (
        <Tabs
            screenOptions={{
                headerStyle: {
                    backgroundColor: bgColor,
                },
                headerTintColor: textColor,
            }}
        >
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
                name="(tasks)"
                options={{
                    title: "Tasks",
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <ClipboardListIcon color={color} />
                    ),
                    href: userType === 'teacher' ? null : "/(tasks)"
                }}
            />
            <Tabs.Screen
                name="(recordingList)"
                options={{
                    title: "Recording List",
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'list' : 'list-sharp'} color={color} />
                    ),
                    href: userType !== 'teacher' ? null : "/(recordingList)"
                }}
            />

            <Tabs.Screen
                name="(addRecording)"
                options={{
                    title: "Add Recording",
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'add' : 'add-sharp'} color={color} />
                    ),
                    href: userType !== 'teacher' ? null : "/(addRecording)"
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
