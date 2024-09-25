import { useThemeColor } from "@/hooks/useThemeColor";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Trie } from "./trie";
import { useTiwiListContext } from "@/contexts/TiwiContext";

type SearchBarProps = {
    searchResults: (data: string[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchResults }) => {
    const textColor = useThemeColor({}, "text");
    const primary = useThemeColor({}, "primary");

    const [searchTerm, setSearchTerm] = useState<string>("");
    const trieRef = useRef<Trie | null>(null);

    const data = useTiwiListContext();

    useEffect(() => {
        const trie = new Trie();

        for (const item in data) {
            trie.insert(data[item].English, item)
            trie.insert(data[item].Tiwi, item)
            if (data[item]["Gloss (tiwi)"]) {
                trie.insert(data[item]["Gloss (tiwi)"]!, item)
            }
            if (data[item]["Gloss (english)"]) {
                trie.insert(data[item]["Gloss (english)"]!, item)
            }
        }

        trieRef.current = trie;
    }, [data])

    const handleSearch = () => {
        // todo error handling
        if (data) {
            const results = trieRef.current?.prefixOf(searchTerm, data);
            searchResults(results ? results : []);
        }
    }

    return (
        <View>
            <TextInput
                autoCorrect={false}
                value={searchTerm}
                onChangeText={(text) => setSearchTerm(text)}
                style={[styles.searchBar, {}]}
                placeholder={"Search here..."}
                placeholderTextColor={primary}
                cursorColor={textColor}
                onSubmitEditing={() => handleSearch()}
            />
        </View>
    );
}

export default SearchBar;

const styles = StyleSheet.create({
    searchBar: {
        borderBottomWidth: 0.2,
    },
})
