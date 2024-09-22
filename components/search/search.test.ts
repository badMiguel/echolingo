import { DataType } from "@/contexts/TiwiContext";
import { Trie } from "./search";
import jsonData from "@/data/json/tiwi_list.json";

describe("trie x literal search", () => {
    let trie: Trie;
    let data: DataType = jsonData;

    beforeEach(() => {
        trie = new Trie();

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
    });

    test("find result with prefix matching", () => {
        const result1 = trie.prefixOf("LOTS", data);
        expect(result1).toContain("172");
        expect(result1).toContain("174");
        expect(result1).not.toContain("1");

        const result2 = trie.prefixOf("SomEtimes", data);
        expect(result2).toContain("171");
        expect(result2).not.toContain("1");
    });

    test("fallback to literal search", () => {
        const result1 = trie.prefixOf("meow", data);
        expect(result1).toEqual([]);

        const result2 = trie.prefixOf("around", data);
        expect(result2).toEqual(["173"]);
    });
});

