import { Tabs, useLocalSearchParams } from "expo-router";
import { TabBarIcon, UserIcon, ClipboardListIcon } from "@/components/navigation/TabBarIcon";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../(tabs)';
import Tasks from '../(tabs)';
import RecordingList from "./recordingList";
import Profile from "./profile";
import AddRecording from "./addRecording";

const Tab = createBottomTabNavigator();

export default function RootLayout() {
    const urlParams = useLocalSearchParams();
    const userType = urlParams['role'];

    return (
        <Tab.Navigator>
            <Tab.Screen
                name="home"
                component={Home}
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size, focused }) => (
                        <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} size={size} />
                    ),
                }}
            />
            {userType === 'student' ?
                (
                    <Tab.Screen
                        name="tasks"
                        component={Tasks}
                        options={{
                            title: "Tasks",
                            tabBarIcon: ({ color }) => (
                                <ClipboardListIcon color={color} />
                            )
                        }}
                    />
                )
                :
                (
                    <>
                        <Tab.Screen
                            name="recordingList"
                            component={RecordingList}
                            options={{
                                title: "Recording List",
                                tabBarIcon: ({ color, focused }) => (
                                    <TabBarIcon name={focused ? 'list' : 'list-sharp'} color={color} />
                                )
                            }}
                        />

                        <Tab.Screen
                            name="addRecording"
                            component={AddRecording}
                            options={{
                                title: "Add Recording",
                                tabBarIcon: ({ color, focused }) => (
                                    <TabBarIcon name={focused ? 'add' : 'add-sharp'} color={color} />
                                )
                            }}
                        />
                    </>
                )}

            <Tab.Screen
                name="profile"
                component={Profile}
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color }) => (
                        <UserIcon color={color} />
                    )
                }}
            />
        </Tab.Navigator>
    );
}
