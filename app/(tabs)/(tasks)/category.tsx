import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, SectionList, StyleSheet, Text, View } from "react-native";
import { useCategoryContext } from "@/contexts/CategoryContext";
import { useTiwiListContext, useSetTiwiContext, Entry, DataType } from "@/contexts/TiwiContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import SearchBar from "@/components/search/search";
import { useSubmissions } from "@/contexts/SubmissionsContext";
import { useCallback } from "react";
import { Switch } from "react-native-paper";


const useColor = () => {
    return {
        bgColor: useThemeColor({}, "background"),
        textColor: useThemeColor({}, "text"),
        primary: useThemeColor({}, "primary"),
        primary_tint: useThemeColor({}, "primary_tint"),
    };
};

export default function Category() {
    const navigation = useNavigation();
    const { category } = useCategoryContext();
    const tiwiList = useTiwiListContext();
    const color = useColor();

    const [searchedTerm, setSearchedTerm] = useState<string>();
    const [searchResults, setSearchResults] = useState<DataType>();

    const [isRefreshing, setIsRefreshing] = useState(false);

    const { submissions, isLoading, refreshSubmissions } = useSubmissions();

    const normalizeString = (str: string) => {
        if (!str) {
            // console.log("fixed")
            return "";
        }
        return str.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    };

    const getSubmissionCount = useCallback(
        (sentenceEnglish: string | undefined) => {
            if (!sentenceEnglish) {
                console.error("getSubmissionCount: sentenceEnglish is undefined");
                return 0;
            }
            const normalizedSentence = normalizeString(sentenceEnglish);
            const count = submissions.filter((sub) => {
                const normalizedSubmission = normalizeString(sub.sentenceEnglish);
                return (
                    normalizedSubmission.includes(normalizedSentence) 
                );
            }).length;
            // console.log(`getSubmissionCount for "${sentenceEnglish}":`, count);
            return count;
        },
        [submissions]
    );

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refreshSubmissions();
        setIsRefreshing(false);
    };

    // change header title dynamically
    useEffect(() => {
        if (category !== "unknown") {
            navigation.setOptions({
                title: category,
            });
        }
    }, [navigation]);

    const handleSearch = (searchList: string[] | Map<string, string[]>, searchedTerm: string) => {
        // todo better error handling
        if (!tiwiList) {
            console.error("Error loading tiwi list");
        } else {
            const newItems: DataType = {};

            if (Array.isArray(searchList)) {
                for (const i of searchList) {
                    newItems[i] = tiwiList[i];
                }
            } else {
                for (const i of searchList) {
                    for (const j of i[1]) {
                        newItems[j] = tiwiList[j];
                    }
                }
            }

            setSearchedTerm(searchedTerm);
            setSearchResults(newItems);
        }
    };

    const getSectionData = (): [string, Entry][] => {
        if (searchResults && Object.keys(searchResults).length > 0) {
            return Object.entries(searchResults);
        } else if (tiwiList) {
            return Object.entries(tiwiList);
        }
        return [];
    };

    const section = [
        {
            title: "Sentences",
            data: getSectionData()
        }
    ];

    return (
        <View style={[{ flex: 1, backgroundColor: color.bgColor }]}>
            <SearchBar searchResults={handleSearch} />
            {searchResults && Object.entries(searchResults).length == 0 && (
                <ThemedText style={{ padding: 30 }}>
                    No search results for {searchedTerm}
                </ThemedText>
            )}
            {tiwiList ? (
                <SectionList
                    // style={styles.flatlist}
                    sections={section}
                    renderItem={({ item }) => 
                        <SentenceCard 
                            tiwi={item[1]}
                            submissionCount={getSubmissionCount(item[1].English)} />}
                    keyExtractor={(item) => item[0]}
                    style={styles.sectionlist}
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                />
            ) : (
                <ThemedText>No sentences available</ThemedText>
            )}
        </View>
    );
}

const SentenceCard: React.FC<{ tiwi: Entry; submissionCount: number; }> = ({ tiwi, submissionCount }) => {
    const setCurrentID = useSetTiwiContext();
    const color = useColor();
    const id: string = Object.keys(tiwi)[0];
    const goToSentence = () => {
        if (setCurrentID) {
            setCurrentID(tiwi);
        } // todo error handle ???

        router.push({
            pathname: "/(tabs)/sentence",
        });
    };

    const goToSubmissions = () => {
        console.log("Navigating to submissions with sentenceID:", id);
        router.push({
            pathname: "/submissions",
            params: {
                sentenceID: id,
                sentenceEnglish: tiwi.English,
            },
        });
    };

    return (
        <View style={[styles.sentenceCard__container, { backgroundColor: color.primary_tint }]}>
            <ThemedText type="defaultSemiBold">{tiwi.Tiwi ? "Tiwi: " : "Tiwi Gloss: "}</ThemedText>
            <ThemedText>{tiwi.Tiwi || tiwi["Gloss (tiwi)"]}</ThemedText>
            <ThemedText type="defaultSemiBold">
                {tiwi.English ? "English: " : "English Gloss: "}
            </ThemedText>
            <ThemedText>{tiwi.English || tiwi["Gloss (english)"]}</ThemedText>
            <Pressable
                style={[styles.button__container, { backgroundColor: color.primary }]}
                onPress={() => goToSentence()}
            >
                <ThemedText type="defaultSemiBold" style={{ color: color.bgColor }}>
                    Study
                </ThemedText>
            </Pressable>

            <Pressable
                style={[
                    styles.button__container,
                    { backgroundColor: submissionCount > 0 ? color.primary : "#ddd" },
                ]}
                onPress={goToSubmissions}
                disabled={submissionCount === 0}
            >
                <ThemedText
                    type="defaultSemiBold"
                    style={{ color: submissionCount > 0 ? color.bgColor : "#aaa" }}
                >
                    Submissions ({submissionCount})
                </ThemedText>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    flatlist: {
        paddingLeft: 30,
        paddingRight: 30,
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
    sectionlist: {
        paddingLeft: 30,
        paddingRight: 30,
    },

    sectionlist__header: {
        alignItems: "center",
        marginTop: 30,
        flexDirection: "row",
        justifyContent: "space-between",
    },
});
