import { DataType } from "@/contexts/TiwiContext";
import { View } from "react-native";

type TrieNode = {
    children: Map<string, TrieNode>;
    id: string;
}

function createTrieNode(): TrieNode {
    return {
        children: new Map(),
        id: "0"
    }
}

// for auto-completion on search
class Trie {
    root: TrieNode;

    constructor() {
        this.root = createTrieNode();
    }

    insert(phrase: string, id: string) {
        let node = this.root;

        for (const char of phrase) {
            if (!node.children.has(char)) {
                node.children.set(char, createTrieNode());
            }

            node = node.children.get(char)!;
        }

        node.id = id;
    }

    prefixOf(searchTerm: string, data: DataType): string[] {
        const potential: string[] = [];
        let prefix: string = ""
        let node: TrieNode = this.root;

        for (const char of searchTerm) {
            if (!node.children.has(char)) {
                return this.literalSearch(searchTerm, data);
            }

            prefix += char;
            if (node.id !== "0") {
                potential.push(node.id);
            }

            if (potential.length > 11) {
                return potential;
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
        if (potential.length > 11) {
            return;
        }

        if (node.id !== "0") {
            potential.push(node.id);
        }

        for (const child in node.children) {
            this.checkChild(potential, prefix + child, node.children.get(child)!);
        }
    }

    // fallback when no results from trie. perform exhaustive search
    private literalSearch(searchTerm: string, data: DataType): string[] {
        const filtered: string[] = [];
        const searchTerms = searchTerm.split(" ");

        for (const key in Object.keys(data)) {
            const entry = data[key]

            // only checks if there is at least one match then push to potential
            const hasMatch = (field: string | null): boolean => {
                if (!field) return false;
                const term = field.split(" ");
                return term.some(word => searchTerms.includes(word));
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
    return (
        <View>
        </View>
    );
}
