import { Tabs } from "expo-router";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Feather, FontAwesome5 } from "@expo/vector-icons";

interface IconProps {
    color?: string
}

const ClipboardListIcon: React.FC<IconProps> = ({ color }): React.JSX.Element => {
    return <FontAwesome5 name='clipboard-list' size={24} color={color} />;
}

const UserIcon: React.FC<IconProps> = ({ color }): React.JSX.Element => {
    return <Feather name='user' size={24} color={color} />;
}

export default function RootLayout() {
    return (
        <Tabs
            // screenOptions={{
            //     headerShown: false
            // }}>
            >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'home' : 'home-sharp'} color={color} />
                    )
                }}
            />

            <Tabs.Screen
                name="tasks"
                options={{
                    title: "Tasks",
                    tabBarIcon: ({ color }) => (
                        <ClipboardListIcon color={color} />
                    )
                }}
            />

            <Tabs.Screen
                name="recordingList"
                options={{
                    title: "Recording List",
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'list' : 'list-sharp'} color={color} />
                    )
                }}
            />

            <Tabs.Screen
                name="addRecording"
                options={{
                    title: "Add Recording",
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'add' : 'add-sharp'} color={color} />
                    )
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
