import { Tabs, useLocalSearchParams } from "expo-router";
import { TabBarIcon, UserIcon, ClipboardListIcon } from "@/components/navigation/TabBarIcon";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../(tabs)';
import Tasks from '../(tabs)/tasks';
import RecordingList from "./recordingList";
import Profile from "./profile";
import AddRecording from "./addRecording";
import { UserContext } from "./UserContext";

const Tab = createBottomTabNavigator();

export default function RootLayout() {
    const params = useLocalSearchParams();
    const userType = Array.isArray(params.userType) ? params.userType[0] : params.userType;
    const userName = Array.isArray(params.userName) ? params.userName[0] : params.userName;

    return (
        <UserContext.Provider value={{ userType, userName }}>
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
        </UserContext.Provider>
    );
}
