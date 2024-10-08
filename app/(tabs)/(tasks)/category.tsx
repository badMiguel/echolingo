import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useCategoryContext } from "@/contexts/CategoryContext";
import { useTiwiListContext, useSetTiwiContext, Entry, DataType } from "@/contexts/TiwiContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import SearchBar from "@/components/search/search";

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

    return (
        <View style={[{ flex: 1, backgroundColor: color.bgColor }]}>
            <SearchBar searchResults={handleSearch} />
            {searchResults && Object.entries(searchResults).length == 0 && (
                <ThemedText style={{ padding: 30 }}>
                    No search results for {searchedTerm}
                </ThemedText>
            )}
            {tiwiList ? (
                <FlatList
                    style={styles.flatlist}
                    data={searchResults ? Object.entries(searchResults) : Object.entries(tiwiList)}
                    renderItem={({ item }) => <SentenceCard tiwi={item[1]} />}
                    keyExtractor={(item) => item[0]}
                />
            ) : (
                <Text>No sentences made yet for this category</Text>
            )}
        </View>
    );
}

const SentenceCard: React.FC<{ tiwi: Entry }> = ({ tiwi }) => {
    const setCurrentID = useSetTiwiContext();
    const color = useColor();

    const goToSentence = () => {
        if (setCurrentID) {
            setCurrentID(tiwi);
        } // todo error handle ???

        router.push({
            pathname: "/sentence",
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
            <View style={[styles.button__container, { backgroundColor: color.primary }]}>
                <Pressable onPress={() => goToSentence()}>
                    <ThemedText type="defaultSemiBold" style={{ color: color.bgColor }}>
                        Study
                    </ThemedText>
                </Pressable>
            </View>
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
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 30,
        paddingRight: 30,
        borderRadius: 10,
        alignSelf: "center",
    },
});
