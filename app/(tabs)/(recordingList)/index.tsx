import { Pressable, SectionList, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { DataType, emptyTiwiData, useTiwiListContext } from "@/contexts/TiwiContext";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import SearchBar from "@/components/search/search";
import { Switch } from "react-native-paper";

const useColor = () => {
    return {
        bgColor: useThemeColor({}, "background"),
        textColor: useThemeColor({}, "text"),
        primary: useThemeColor({}, "primary"),
        primary_tint: useThemeColor({}, "primary_tint"),
    };
};

function filterRecorded(data: DataType): { recorded: DataType[]; notRecorded: DataType[] } {
    let recorded: DataType[] = [];
    let notRecorded: DataType[] = [];

    // todo optimise
    const recordedKey = new Set(Object.keys(data).filter((key) => data[key]["recording"]));

    for (const key in data) {
        if (recordedKey.has(key)) {
            recorded.push({ [key]: data[key] });
        } else {
            notRecorded.push({ [key]: data[key] });
        }
    }

    return { recorded, notRecorded };
}

export default function RecordingList() {
    const [dataRecorded, setDataRecorded] = useState<DataType[]>([]);
    const [dataNotRecorded, setDataNotRecorded] = useState<DataType[]>([]);
    const [searchResults, setSearchResults] = useState<
        string[] | Map<string, string[]> | undefined
    >();
    const [showRecorded, setShowRecorded] = useState<boolean>(false);

    const data = useTiwiListContext();
    const color = useColor();

    useEffect(() => {
        // todo error handling and optimisation
        if (data) {
            const { recorded, notRecorded } = filterRecorded(data);

            setDataRecorded(recorded);
            setDataNotRecorded(notRecorded);
        }
    }, []);

    useEffect(() => {
        // todo better error handling and optimisation
        if (!data) {
            console.error("Error Loading Data");
        } else if (searchResults) {
            const newItems: DataType = {};

            if (Array.isArray(searchResults)) {
                for (const i of searchResults) {
                    newItems[i] = data[i];
                }
            } else {
                for (const i of searchResults) {
                    for (const j of i[1]) {
                        newItems[j] = data[j];
                    }
                }
            }

            const { recorded, notRecorded } = filterRecorded(newItems);

            setDataRecorded(recorded);
            setDataNotRecorded(notRecorded);
        } else if (data) {
            const { recorded, notRecorded } = filterRecorded(data);

            setDataRecorded(recorded);
            setDataNotRecorded(notRecorded);
        }
    }, [data, searchResults]);

    const sections = [
        {
            title: showRecorded ? "With Recording" : "Without Recording",
            data: showRecorded
                ? dataRecorded.length > 0
                    ? dataRecorded
                    : [{ "0": emptyTiwiData() }]
                : dataNotRecorded.length > 0
                  ? dataNotRecorded
                  : [{ "0": emptyTiwiData() }],
        },
    ];

    const handleSearchResults = (searchList: string[] | Map<string, string[]>) => {
        setSearchResults(searchList);
    };

    return (
        <View style={{ flex: 1, backgroundColor: color.bgColor }}>
            <SearchBar searchResults={handleSearchResults} />
            <SectionList
                sections={sections}
                keyExtractor={(item) => Object.keys(item)[0]}
                renderItem={({ item }) =>
                    Object.keys(item)[0] === "0" ? (
                        item.completed ? (
                            <ThemedText style={{}}>All sentences have been recorded</ThemedText>
                        ) : (
                            <ThemedText style={{ marginBottom: 30 }}>
                                No sentences recorded yet
                            </ThemedText>
                        )
                    ) : (
                        <SentenceCard sentence={item} finished={false} />
                    )
                }
                renderSectionHeader={({ section: { title } }) => (
                    <View style={styles.sectionlist__header}>
                        <ThemedText type="subtitle">{title}</ThemedText>
                        <Switch
                            onValueChange={() => setShowRecorded(!showRecorded)}
                            value={showRecorded}
                        />
                    </View>
                )}
                style={styles.sectionlist}
            />
        </View>
    );
}

const SentenceCard: React.FC<{ sentence: DataType; finished: boolean }> = ({
    sentence: sentence,
}) => {
    const id: string = Object.keys(sentence)[0];
    const color = useColor();
    const hasSubmissions = sentence[id].submissions && sentence[id].submissions;

    const goToSentence = () => {
        router.push({
            pathname: sentence[id].recording ? "/viewRecording" : "/(addSentence)",
            params: {
                sentenceID: id,
            },
        });
    };

    const goToSubmissions = () => {
        router.push({
            pathname: "/submissions",
            params: {
                sentenceID: id,
            },
        });
    };

    return (
        <View style={[styles.sentenceCard__container, { backgroundColor: color.primary_tint }]}>
            <ThemedText type="defaultSemiBold">
                {sentence[id].Tiwi ? "Tiwi: " : "Tiwi Gloss: "}
            </ThemedText>
            <ThemedText>{sentence[id].Tiwi}</ThemedText>
            <ThemedText type="defaultSemiBold">
                {sentence[id].English ? "English: " : "English Gloss: "}
            </ThemedText>
            <ThemedText>{sentence[id].English}</ThemedText>

            <Pressable
                style={[styles.button__container, { backgroundColor: color.primary }]}
                onPress={() => goToSentence()}
            >
                <ThemedText type="defaultSemiBold" style={{ color: color.bgColor }}>
                    {sentence[id].recording ? "View" : "Add Recording"}
                </ThemedText>
            </Pressable>

            <Pressable
                style={[
                    styles.button__container,
                    { backgroundColor: hasSubmissions ? color.primary : "#ddd" },
                ]}
                onPress={goToSubmissions}
                disabled={!hasSubmissions}
            >
                <ThemedText
                    type="defaultSemiBold"
                    style={{ color: hasSubmissions ? color.bgColor : "#aaa" }}
                >
                    Submissions
                </ThemedText>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionlist: {
        paddingLeft: 30,
        paddingRight: 30,
    },

    sectionlist__header: {
        marginTop: 30,
        flexDirection: "row",
        justifyContent: "space-between",
    },

    sentenceCard__container: {
        marginBottom: 10,
        marginTop: 10,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 10,
        gap: 10,
    },

    button__container: {
        marginTop: 5,
        paddingTop: 7,
        paddingBottom: 5,
        paddingLeft: 30,
        paddingRight: 30,
        borderRadius: 10,
        alignSelf: "center",
    },
});
