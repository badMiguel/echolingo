import { View } from "react-native";

type TrieNode = {
    children: Map<string, TrieNode>;
    id: number;
}

function createTrieNode(): TrieNode {
    return {
        children: new Map(),
        id: 0
    }
}

// for auto-completion on search
class Trie {
    root: TrieNode;

    constructor() {
        this.root = createTrieNode();
    }

    insert(phrase: string, id: number) {
        let node = this.root;

        for (const char of phrase) {
            if (!node.children.has(char)) {
                node.children.set(char, createTrieNode());
            }

            node = node.children.get(char)!;
        }

        node.id = id;
    }

    prefixOf(phrase: string): number[] {
        const potential: number[] = [];
        let node: TrieNode = this.root;

        for (const char of phrase) {
            if (!node.children.has(char)) {
                return literalSearch();
            }

            if (node.id !== 0) {
                potential.push(node.id);
            }

            if (typeof node === "object") {
                node = node.children.get(char)!;
            } else {
                break;
            }
        }

        this.checkChild(potential, node);
        return potential;
    }

    private checkChild(potential: number[], node: TrieNode) {
    }
}

// fallback when no results from trie
function literalSearch(): number[] {
    return []; // change this
}

export default function SearchBar() {
    return (
        <View>
        </View>
    );
}
