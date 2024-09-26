import { Tabs, useLocalSearchParams } from "expo-router";
import { TabBarIcon, UserIcon, ClipboardListIcon } from "@/components/navigation/TabBarIcon";
import { useThemeColor } from "@/hooks/useThemeColor";
import { CategoryProvider } from "@/contexts/CategoryContext";
import { TiwiProvider } from "@/contexts/TiwiContext";

export default function RootLayout() {
    const primary = useThemeColor({}, "primary");
    const primary_tint = useThemeColor({}, "primary_tint");
    const bgColor = useThemeColor({}, "background");
    const textColor = useThemeColor({}, "text");

    const params = useLocalSearchParams();
    const userType = Array.isArray(params.userType) ? params.userType[0] : params.userType;

    return (
        <CategoryProvider>
            <TiwiProvider>
                <Tabs
                    screenOptions={{
                        tabBarStyle: { height: 60 },
                        tabBarShowLabel: true,
                        headerStyle: { backgroundColor: bgColor, shadowColor: "black" },
                        headerTintColor: textColor,
                        tabBarLabelStyle: { fontSize: 12 },
                    }}
                >
                    <Tabs.Screen
                        name="index"
                        options={{
                            title: "Home",
                            tabBarActiveTintColor: primary,
                            tabBarInactiveTintColor: primary_tint,
                            tabBarIcon: ({ focused }) => (
                                <TabBarIcon
                                    name={focused ? "home" : "home-outline"}
                                    color={focused ? primary : primary_tint}
                                    size={30}
                                />
                            ),
                            tabBarLabel: "Home", 
                        }}
                    />
                    <Tabs.Screen
                        name="(tasks)"
                        options={{
                            title: "Tasks",
                            headerShown: false,
                            tabBarActiveTintColor: primary,
                            tabBarInactiveTintColor: primary_tint,
                            tabBarIcon: ({ focused }) => (
                                <ClipboardListIcon
                                    color={focused ? primary : primary_tint}
                                    size={30}
                                />
                            ),
                            tabBarLabel: "Tasks",
                            href: userType === "teacher" ? null : "/(tasks)",
                        }}
                    />
                    <Tabs.Screen
                        name="(recordingList)"
                        options={{
                            title: "Recording List",
                            headerShown: false,
                            tabBarActiveTintColor: primary,
                            tabBarInactiveTintColor: primary_tint,
                            tabBarIcon: ({ focused }) => (
                                <TabBarIcon
                                    name={focused ? "list" : "list-sharp"}
                                    color={focused ? primary : primary_tint}
                                    size={30}
                                />
                            ),
                            tabBarLabel: "Recordings",
                            href: userType !== "teacher" ? null : "/(recordingList)",
                        }}
                    />

                    <Tabs.Screen
                        name="(addRecording)"
                        options={{
                            title: "Add Recording",
                            headerShown: false,
                            tabBarActiveTintColor: primary,
                            tabBarInactiveTintColor: primary_tint,
                            tabBarIcon: ({ focused }) => (
                                <TabBarIcon
                                    name={focused ? "add" : "add-sharp"}
                                    color={focused ? primary : primary_tint}
                                    size={30}
                                />
                            ),
                            tabBarLabel: "Add",
                            href: userType !== "teacher" ? null : "/(addRecording)",
                        }}
                    />

                    <Tabs.Screen
                        name="(challenges)"
                        options={{
                            title: "Challenges",
                            headerShown: false,
                            tabBarActiveTintColor: primary,
                            tabBarInactiveTintColor: primary_tint,
                            tabBarIcon: ({ focused }) => (
                                <TabBarIcon
                                    name={focused ? "checkmark" : "checkmark-outline"}
                                    color={focused ? primary : primary_tint}
                                    size={30}
                                />
                            ),
                            tabBarLabel: "Challenges",
                            href: userType !== "student" ? null : "/(challenges)",
                        }}
                    />
                    <Tabs.Screen
                        name="profile"
                        options={{
                            title: "Profile",
                            tabBarActiveTintColor: primary,
                            tabBarInactiveTintColor: primary_tint,
                            tabBarIcon: ({ focused }) => (
                                <UserIcon color={focused ? primary : primary_tint} size={30} />
                            ),
                            tabBarLabel: "Profile",
                        }}
                    />
                </Tabs>
            </TiwiProvider>
        </CategoryProvider>
    );
}
