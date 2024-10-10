import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Entry, useTiwiContext } from "@/contexts/TiwiContext";
import { useNavigation } from "expo-router";
import AudioPlayback from "@/components/audio/playback";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import { useCategoryContext } from "@/contexts/CategoryContext";
import * as FileSystem from "expo-file-system";
import { Record } from "../(addSentence)/recording";

export default function Sentence() {
    const navigation = useNavigation();
    const current = useTiwiContext();
    const bgColor = useThemeColor({}, "background");
    const { category } = useCategoryContext();

    useEffect(() => {
        if (category !== "unknown") {
            navigation.setOptions({
                title: category,
            });
        }
    }, [navigation]);

    return (
        <View style={[styles.mainView, { backgroundColor: bgColor }]}>
            {!current ? (
                <View>
                    <ThemedText>Congratulations! You have completed this category.</ThemedText>
                </View>
            ) : (
                <>
                    <Question current={current} />
                    <ThemedText type="defaultSemiBold">Make your own recording:</ThemedText>
                    <Record fromStudent={true} />
                    <View style={{ flex: 1 }} />
                </>
            )}
        </View>
    );
}

const Question: React.FC<{ current: Entry }> = ({ current }) => {
    return (
        <View style={styles.questionView}>
            {current.Tiwi && (
                <View>
                    <ThemedText type="defaultSemiBold">Tiwi:</ThemedText>
                    <ThemedText>{current.Tiwi}</ThemedText>
                </View>
            )}

            {current["Gloss (tiwi)"] && (
                <View>
                    <ThemedText type="defaultSemiBold">Tiwi (Gloss):</ThemedText>
                    <ThemedText>{current["Gloss (tiwi)"]}</ThemedText>
                </View>
            )}

            {current.recording ? (
                <View>
                    <ThemedText type="defaultSemiBold">Teachers Recording:</ThemedText>
                    <AudioPlayback uri={FileSystem.documentDirectory + current.recording} />
                </View>
            ) : (
                <ThemedText type="defaultSemiBold" style={{ alignSelf: "center" }}>
                    No recording available yet
                </ThemedText>
            )}

            {current.English && (
                <View>
                    <ThemedText type="defaultSemiBold">English:</ThemedText>
                    <ThemedText>{current.English}</ThemedText>
                </View>
            )}

            {current["Gloss (english)"] && (
                <View>
                    <ThemedText type="defaultSemiBold">English (Gloss):</ThemedText>
                    <ThemedText>{current["Gloss (english)"]}</ThemedText>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        paddingLeft: 30,
        paddingRight: 30,
        justifyContent: "space-around",
    },

    questionView: {
        flex: 2,
        justifyContent: "space-evenly",
    },

    button__container: {
        marginTop: 5,
        paddingTop: 1,
        paddingBottom: 1,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 10,
        alignSelf: "center",
    },
});
