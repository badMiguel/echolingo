import { View, Button, StyleSheet } from "react-native";
import React, { createContext } from "react";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import * as FileSystem from "expo-file-system";
import data from "../data/json/tiwi_list.json";

export const UserTypeContext = createContext("");

export default function Index() {
    const bgColor = useThemeColor({}, "background");
    const buttonColor = useThemeColor({}, "primary");

    const copyData = async () => {
        const fileUri = FileSystem.documentDirectory + "tiwi_list.json";
        const fileInfo = await FileSystem.getInfoAsync(fileUri);

        // tiwi_list does not exist on user device
        if (!fileInfo.exists) {
            const copyStatus = await copyJsonData();

            if (!copyStatus) {
                console.error("Failed to copy json");
                return { status: false };
            }
        }
    };

    copyData();

    const login = (type: string, name: string) => {
        router.push({
            pathname: "/(tabs)",
            params: {
                userType: type,
                userName: name,
            },
        });
    };

    return (
        <View style={[styles.mainView, { backgroundColor: bgColor }]}>
            <Button
                color={buttonColor}
                onPress={() => login("student", "Student")}
                title="Student View"
            />
            <Button
                color={buttonColor}
                onPress={() => login("teacher", "Teacher")}
                title="Teacher View"
            />
        </View>
    );
}

// save the tiwi data to user's local storage
// allows to make changes on json to add recordings
// cant edit json directly when bundled with app
async function copyJsonData() {
    try {
        // for production. get tiwi json from build data
        // const data = Asset.fromModule(require('@/data/json/tiwi_list.json'));
        // await data.downloadAsync();
        // const sourceUri = data.localUri;
        const targetUri = FileSystem.documentDirectory + "tiwi_list.json";
        // try {
        //     if (sourceUri) {
        //         await FileSystem.copyAsync({
        //             from: sourceUri,
        //             to: targetUri,
        //         })
        //     } else {
        //         throw new Error('sourceUri is null');
        //     }
        // } catch (err) {
        //     console.error('Failed to copy tiwi data', err);
        //     return false
        // }
        await FileSystem.writeAsStringAsync(targetUri, JSON.stringify(data));
        return true;
    } catch (err) {
        console.error("Failed to copy json data", err);
        return false;
    }
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 20,
    },
});
