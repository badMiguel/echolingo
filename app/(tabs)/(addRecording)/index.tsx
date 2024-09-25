import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { Entry, useTiwiListContext } from "@/contexts/TiwiContext";
import useCRUD from "@/hooks/recording/useCRUD";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import categoryData from "@/data/json/category_data.json";
import { Dropdown } from "react-native-element-dropdown";

type AddDetailProp = {
    currentID: number | undefined;
    current: Entry | undefined;
    changeCurrent: (currentID: number) => void;
};

const useColor = () => {
    return {
        bgColor: useThemeColor({}, "background"),
        textColor: useThemeColor({}, "text"),
        primary: useThemeColor({}, "primary"),
    };
};

export default function Add() {
    const [currentID, setCurrentID] = useState<number>();
    const [current, setCurrent] = useState<Entry | undefined>();

    const { sentenceID } = useLocalSearchParams();
    const data = useTiwiListContext();
    const color = useColor();

    useEffect(() => {
        if (data) {
            // todo error handling
            const id: string = Array.isArray(sentenceID) ? sentenceID[0] : sentenceID;
            const item: Entry | undefined = data[id];

            setCurrentID(parseInt(id));
            setCurrent(item);
        }
    }, [sentenceID, data]);

    const updateCurrent = (currentID: number) => {
        setCurrentID(currentID);
    };

    return (
        <View style={[styles.mainView, { backgroundColor: color.bgColor }]}>
            <AddDetails currentID={currentID} current={current} changeCurrent={updateCurrent} />
            {currentID ? (
                <>
                    <AddRecording currentID={currentID} />
                    {sentenceID && (
                        <Pressable
                            style={[styles.button, { backgroundColor: color.primary }]}
                            onPress={() => router.navigate("/(recordingList)")}
                        >
                            <ThemedText type="defaultSemiBold" style={{ color: color.bgColor }}>
                                Back
                            </ThemedText>
                        </Pressable>
                    )}
                </>
            ) : null}
        </View>
    );
}

const AddDetails: React.FC<AddDetailProp> = ({ currentID, current, changeCurrent }) => {
    const [tiwi, setTiwi] = useState<string | undefined>();
    const [tiwiGloss, setTiwiGloss] = useState<string | undefined>();
    const [english, setEnglish] = useState<string | undefined>();
    const [englishGloss, setEnglishGloss] = useState<string | undefined>();
    const [topic, setTopic] = useState<string | undefined>();

    const [tiwiError, setTiwiError] = useState<boolean>(false);
    const [englishError, setEnglishError] = useState<boolean>(false);
    const [topicError, setTopicError] = useState<boolean>(false);

    const { saveDetails, addDetails } = useCRUD();
    const color = useColor();

    useEffect(() => {
        if (current) {
            current.Tiwi && setTiwi(current.Tiwi);
            current["Gloss (tiwi)"] && setTiwiGloss(current["Gloss (tiwi)"]);
            current.English && setEnglish(current.English);
            current["Gloss (english)"] && setEnglishGloss(current["Gloss (english)"]);
            current.Topic && setTopic(current.Topic);
        } else {
            clearForm();
        }
    }, [current]);

    const clearForm = () => {
        setTiwi(undefined);
        setTiwiGloss(undefined);
        setEnglish(undefined);
        setEnglishGloss(undefined);
        setTopic(undefined);
        setEnglishError(false);
        setTiwiError(false);
        setTopicError(false);
    };

    // todo add validation and error handling
    const updateDetails = async () => {
        let error: boolean = false;
        if (!tiwi) {
            setTiwiError(true);
            error = true;
        }

        if (!english) {
            setEnglishError(true);
            error = true;
        }

        if (!topic) {
            setTopicError(true);
            error = true;
        }

        if (error) {
            return;
        }

        try {
            if (!current) {
                const { status, currentID } = await addDetails({
                    tiwi: tiwi,
                    gTiwi: tiwiGloss,
                    english: english,
                    gEnglish: englishGloss,
                    topic: topic,
                });
                if (!status) {
                    throw new Error("Failed to create new data");
                }

                // todo error handling
                currentID && changeCurrent(currentID);
                router.setParams({ sentenceID: currentID });
            } else {
                // todo error handling
                if (currentID) {
                    await saveDetails(currentID, {
                        tiwi: tiwi,
                        gTiwi: tiwiGloss,
                        english: english,
                        gEnglish: englishGloss,
                        topic: topic,
                    });
                }
            }
        } catch (err) {
            console.error("Failed to create new data", err);
        }
    };

    return (
        <View>
            <View style={styles.formItem__container}>
                <ThemedText type="defaultSemiBold">Tiwi</ThemedText>
                <TextInput
                    autoCorrect={false} // might be frustrating if yes for uncommon language
                    value={tiwi}
                    onChangeText={(text) => {
                        setTiwi(text);
                        setTiwiError(false);
                    }}
                    style={[styles.formItem, { borderColor: tiwiError ? "red" : "black" }]}
                    placeholder={tiwiError ? "Should add Tiwi data" : "Enter tiwi"}
                    placeholderTextColor={tiwiError ? "#ff474c" : color.primary}
                    cursorColor={color.textColor}
                />
            </View>

            <View style={styles.formItem__container}>
                <ThemedText type="defaultSemiBold">Tiwi (Gloss)</ThemedText>
                <TextInput
                    autoCorrect={false} // might be frustrating if yes for uncommon language
                    value={tiwiGloss}
                    onChangeText={(text) => {
                        setTiwiGloss(text);
                        setTiwiError(false);
                    }}
                    style={styles.formItem}
                    placeholder={"Enter tiwi gloss"}
                    placeholderTextColor={color.primary}
                    cursorColor={color.textColor}
                />
            </View>

            <View style={styles.formItem__container}>
                <ThemedText type="defaultSemiBold">English</ThemedText>
                <TextInput
                    autoCorrect={false} // might be frustrating if yes for uncommon language
                    value={english}
                    onChangeText={(text) => {
                        setEnglish(text);
                        setEnglishError(false);
                    }}
                    style={[styles.formItem, { borderColor: tiwiError ? "red" : "black" }]}
                    placeholder={englishError ? "Should add English data" : "Enter English"}
                    placeholderTextColor={englishError ? "#ff474c" : color.primary}
                    cursorColor={color.textColor}
                />
            </View>

            <View style={styles.formItem__container}>
                <ThemedText type="defaultSemiBold">English Gloss</ThemedText>
                <TextInput
                    autoCorrect={false} // might be frustrating if yes for uncommon language
                    value={englishGloss}
                    onChangeText={(text) => {
                        setEnglishGloss(text);
                        setEnglishError(false);
                    }}
                    style={[styles.formItem]}
                    placeholder={"Enter English gloss"}
                    placeholderTextColor={color.primary}
                    cursorColor={color.textColor}
                />
            </View>

            <View style={styles.formItem__container}>
                <ThemedText type="defaultSemiBold">Topic</ThemedText>
                <Dropdown
                    // todo add interface to add new topic
                    data={categoryData}
                    labelField="categoryName"
                    valueField="topic"
                    value={topic}
                    onChange={(item) => setTopic(item.topic)}
                    placeholder="Select Topic"
                    placeholderStyle={{
                        color: topicError ? "#ff474c" : color.primary,
                        fontSize: 20,
                    }}
                    style={[styles.formItem, {}]}
                    selectedTextStyle={{ fontSize: 20 }}
                />
            </View>

            <Pressable
                style={[styles.button, { backgroundColor: color.primary }]}
                onPress={() => updateDetails()}
            >
                <ThemedText type="defaultSemiBold" style={{ color: color.bgColor }}>
                    {currentID ? "Update" : "Add"}
                </ThemedText>
            </Pressable>
            <Pressable
                style={[styles.button, { backgroundColor: color.primary }]}
                onPress={() => clearForm()}
            >
                <ThemedText type="defaultSemiBold" style={{ color: color.bgColor }}>
                    Clear
                </ThemedText>
            </Pressable>
        </View>
    );
};

function AddRecording({ currentID }: { currentID: number | undefined }) {
    const color = useColor();
    const record = () => {
        router.push({
            pathname: "/record",
            params: {
                current: currentID ? currentID : undefined,
            },
        });
    };

    const upload = () => {
        router.push({
            pathname: "/upload",
            params: {
                current: currentID ? currentID : undefined,
            },
        });
    };

    return (
        <View>
            <Pressable
                style={[styles.button, { backgroundColor: color.primary }]}
                onPress={() => record()}
            >
                <ThemedText type="defaultSemiBold" style={{ color: color.bgColor }}>
                    Record Now
                </ThemedText>
            </Pressable>
            <Pressable
                style={[styles.button, { backgroundColor: color.primary }]}
                onPress={() => upload()}
            >
                <ThemedText type="defaultSemiBold" style={{ color: color.bgColor }}>
                    Upload From Device
                </ThemedText>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    mainView: {
        paddingTop: 30,
        paddingRight: 30,
        paddingLeft: 30,
        flex: 1,
    },

    formItem: {
        borderBottomWidth: 0.2,
        fontSize: 20,
    },

    formItem__container: {
        marginBottom: 30,
    },

    button: {
        marginBottom: 10,
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: "center",
        borderRadius: 10,
    },
});
