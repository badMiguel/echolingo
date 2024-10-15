import { Tabs } from "expo-router";
import { TabBarIcon, UserIcon, ClipboardListIcon } from "@/components/navigation/TabBarIcon";
import { useThemeColor } from "@/hooks/useThemeColor";
import { CategoryProvider } from "@/contexts/CategoryContext";
import { TiwiProvider } from "@/contexts/TiwiContext";
import { useUserTypeContext } from "@/contexts/UserContext";
import { SubmissionsProvider } from '@/contexts/SubmissionsContext';

export default function RootLayout() {
    const primary = useThemeColor({}, "primary");
    const secondary = useThemeColor({}, "secondary");
    const bgColor = useThemeColor({}, "background");
    const textColor = useThemeColor({}, "text");

    const userType = useUserTypeContext();

    return (
        <CategoryProvider>
            <TiwiProvider>
                <SubmissionsProvider>
                    <Tabs
                        screenOptions={{
                            tabBarStyle: { height: 60 },
                            tabBarShowLabel: true,
                            headerStyle: { backgroundColor: bgColor, shadowColor: "black" },
                            headerTintColor: textColor,
                            tabBarLabelStyle: { fontSize: 12 },
                            tabBarHideOnKeyboard: true,
                            headerTitleStyle: { fontFamily: "Poppins-SemiBold" },
                        }}
                    >
                        <Tabs.Screen
                            name="index"
                            options={{
                                title: "Home",
                                tabBarActiveTintColor: primary,
                                tabBarInactiveTintColor: secondary,
                                tabBarIcon: ({ focused }) => (
                                    <TabBarIcon
                                        name={focused ? "home" : "home-outline"}
                                        color={focused ? primary : secondary}
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
                                tabBarInactiveTintColor: secondary,
                                tabBarIcon: ({ focused }) => (
                                    <ClipboardListIcon
                                        color={focused ? primary : secondary}
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
                                tabBarInactiveTintColor: secondary,
                                tabBarIcon: ({ focused }) => (
                                    <TabBarIcon
                                        name={focused ? "list" : "list-sharp"}
                                        color={focused ? primary : secondary}
                                        size={30}
                                    />
                                ),
                                tabBarLabel: "Recordings",
                                href: userType !== "teacher" ? null : "/(recordingList)",
                            }}
                        />

                        <Tabs.Screen
                            name="(addSentence)"
                            options={{
                                title: "Add Sentence",
                                headerShown: false,
                                tabBarActiveTintColor: primary,
                                tabBarInactiveTintColor: secondary,
                                tabBarIcon: ({ focused }) => (
                                    <TabBarIcon
                                        name={focused ? "add" : "add-sharp"}
                                        color={focused ? primary : secondary}
                                        size={30}
                                    />
                                ),
                                tabBarLabel: "Add",
                                href: userType !== "teacher" ? null : "/(addSentence)",
                            }}
                        />

                        <Tabs.Screen
                            name="(challenges)"
                            options={{
                                title: "Challenges",
                                headerShown: false,
                                tabBarActiveTintColor: primary,
                                tabBarInactiveTintColor: secondary,
                                tabBarIcon: ({ focused }) => (
                                    <TabBarIcon
                                        name={focused ? "checkmark" : "checkmark-outline"}
                                        color={focused ? primary : secondary}
                                        size={30}
                                    />
                                ),
                                tabBarLabel: "Challenges",
                                href: userType !== "student" ? null : "/(challenges)",
                            }}
                        />
                        <Tabs.Screen
                            name="(profile)"
                            options={{
                                title: "Profile",
                                headerShown: false,
                                tabBarActiveTintColor: primary,
                                tabBarInactiveTintColor: secondary,
                                tabBarIcon: ({ focused }) => (
                                    <UserIcon color={focused ? primary : secondary} size={30} />
                                ),
                                tabBarLabel: "Profile",
                            }}
                        />
                    </Tabs>
                </SubmissionsProvider>
            </TiwiProvider>
        </CategoryProvider>
    );
}
