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
        let noTrie: boolean = false;
        let node: TrieNode = this.root;

        for (const char of phrase) {
            if (!node.children.has(char)) {
                noTrie = true;
                break;
            }

            if (node.id !== 0) {
                potential.push(node.id);
            }

            try {
                node = node.children.get(char)!;
            } catch {
                break;
            }
        }

        if (noTrie) {
            return literalSearch();
        } else {
            this.checkChild(potential, node);
            return potential;
        }

    }

    private checkChild(potential: number[], node: TrieNode): number[] {
        return []; // change this
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
