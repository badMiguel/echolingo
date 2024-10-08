import { useThemeColor } from "@/hooks/useThemeColor";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Trie } from "./trie";
import { useTiwiListContext } from "@/contexts/TiwiContext";
import { ThemedText } from "../ThemedText";
import { router, useLocalSearchParams } from "expo-router";

type SearchBarProps = {
    searchResults: (data: string[] | Map<string, string[]>, searchedTerm: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ searchResults }) => {
    const textColor = useThemeColor({}, "text");
    const primary = useThemeColor({}, "primary");
    const primary_tint = useThemeColor({}, "primary_tint");

    const [searchedTerm, setSearchedTerm] = useState<string>("");
    const [results, setResults] = useState<string[] | Map<string, string[]>>([]);
    const [suggestionList, setSuggestionsList] = useState<[string, string[]][]>([]);
    const trieRef = useRef<Trie | null>(null);

    const data = useTiwiListContext();

    useEffect(() => {
        const trie = new Trie();

        for (const item in data) {
            if (data[item]["English"]) {
                trie.insert(data[item].English, item);
            }
            if (data[item]["Tiwi"]) {
                trie.insert(data[item].Tiwi, item);
            }
            if (data[item]["Gloss (tiwi)"]) {
                trie.insert(data[item]["Gloss (tiwi)"]!, item);
            }
            if (data[item]["Gloss (english)"]) {
                trie.insert(data[item]["Gloss (english)"]!, item);
            }
        }

        trieRef.current = trie;
    }, [data]);

    const handleSearch = () => {
        searchResults(results ? results : [], searchedTerm);
        setSuggestionsList([]);
    };

    const handleChange = (text: string) => {
        // todo better error handle
        if (!data) {
            console.error("Error loading data");
            return searchResults([], "");
        }

        const potential = trieRef.current?.prefixOf(text, data);
        // todo better error handle
        if (!potential) {
            return searchResults([], "");
        }

        if (text.length > 0) {
            const suggestions: [string, string[]][] = [];
            for (const item of potential) {
                if (suggestions.length === 5) {
                    break;
                }

                if (typeof item !== "string") {
                    suggestions.push([item[0], item[1]]);
                }
            }

            setSuggestionsList(suggestions);
        } else {
            setSuggestionsList([]);
        }

        setResults(potential);
        setSearchedTerm(text);
    };

    const suggestionPressed = (id: string[]) => {
        router.push({
            pathname: "/(addRecording)",
            params: { sentenceID: id[0] },
        });
    };

    return (
        <View style={[styles.mainView, {}]}>
            <TextInput
                autoCorrect={false}
                value={searchedTerm}
                onChangeText={(text) => handleChange(text)}
                style={[styles.searchBar, {}]}
                placeholder={"Search here..."}
                placeholderTextColor={primary}
                cursorColor={textColor}
                onSubmitEditing={() => handleSearch()}
            />
            {suggestionList.length > 0 && (
                <View style={[styles.suggestion__container, { backgroundColor: primary_tint }]}>
                    <ThemedText type="defaultSemiBold">Suggestions:</ThemedText>
                    {suggestionList.map((item, key) => (
                        <Pressable key={key} onPress={() => suggestionPressed(item[1])}>
                            <View style={[styles.suggestion, {}]}>
                                <Text>-</Text>
                                <ThemedText>{item[0]}</ThemedText>
                            </View>
                        </Pressable>
                    ))}
                </View>
            )}
        </View>
    );
};

export default SearchBar;

const styles = StyleSheet.create({
    mainView: {
        marginTop: 20,
        marginLeft: 30,
        marginRight: 30,
    },

    searchBar: {
        fontSize: 20,
        borderBottomWidth: 0.2,
    },

    suggestion__container: {
        gap: 10,
        marginTop: 20,
        paddingRight: 35,
        paddingLeft: 20,
        paddingTop: 20,
        paddingBottom: 20,
        borderRadius: 10,
        marginBottom: 10,
    },

    suggestion: {
        flexDirection: "row",
        gap: 15,
    },
});
