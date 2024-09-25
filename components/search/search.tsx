import { DataType } from "@/contexts/TiwiContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

type TrieNode = {
    children: Map<string, TrieNode>;
    id: string[];
}

function createTrieNode(): TrieNode {
    return {
        children: new Map(),
        id: []
    }
}

// for auto-completion on search
export class Trie {
    root: TrieNode;

    constructor() {
        this.root = createTrieNode();
    }

    insert(phrase: string, id: string) {
        let node = this.root;

        for (const char of phrase.toLowerCase()) {
            if (!node.children.has(char)) {
                node.children.set(char, createTrieNode());
            }

            node = node.children.get(char)!;
        }

        node.id.push(id);
    }

    prefixOf(searchTerm: string, data: DataType): string[] {
        const potential: string[] = [];
        let prefix: string = ""
        let node: TrieNode = this.root;

        for (const char of searchTerm.toLowerCase()) {
            if (!node.children.has(char)) {
                return this.literalSearch(searchTerm, data);
            }

            prefix += char;
            if (node.id.length > 0) {
                potential.push(...node.id);
            }

            if (potential.length > 10) {
                return potential
            }

            if (typeof node === "object") {
                node = node.children.get(char)!;
            } else {
                break;
            }
        }

        this.checkChild(potential, prefix, node);
        return potential;
    }

    private checkChild(potential: string[], prefix: string, node: TrieNode) {
        if (potential.length > 10) {
            return;
        }

        if (node.id.length > 0) {
            potential.push(...node.id);
        }

        for (const child of node.children.keys()) {
            this.checkChild(potential, prefix + child, node.children.get(child)!);
        }
    }

    // fallback when no results from trie. perform exhaustive search
    literalSearch(searchTerm: string, data: DataType): string[] {
        const filtered: string[] = [];
        const searchTerms = searchTerm.toLowerCase().split(" ");

        for (const key of Object.keys(data)) {
            const entry = data[key]

            // only checks if there is at least one match then push to potential
            const hasMatch = (field: string | null): boolean => {
                if (!field) return false;
                const fieldWords = field.toLowerCase().split(" ");
                return fieldWords.some(word => searchTerms.includes(word));
            }

            if (
                hasMatch(entry.English) ||
                hasMatch(entry.Tiwi) ||
                hasMatch(entry["Gloss (english)"]) ||
                hasMatch(entry["Gloss (tiwi)"])
            ) {
                filtered.push(key)
            }
        }

        return filtered;
    }
}

export default function SearchBar() {
    const textColor = useThemeColor({}, "text");
    const primary = useThemeColor({}, "primary");

    const [searchTerm, setSearchTerm] = useState<string>("");

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
            />
        </View>
    );
}

const styles = StyleSheet.create({
    searchBar: {
        borderBottomWidth: 0.2,
    },
})
