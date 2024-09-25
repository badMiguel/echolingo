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

        const result2 = trie.prefixOf("SomEtimes", data);
        expect(result2).toContain("171");

        const result3 = trie.prefixOf("wHy", data);
        expect(result3).toContain("9");
        for (const i of result3) {
            console.log(data[i])
        }
    });

    test("fallback to literal search", () => {
        const result1 = trie.prefixOf("meow", data);
        expect(result1).toEqual([]);


        const result2 = trie.prefixOf("around", data);
        expect(result2).toContain("173");
        for (const i of result2) {
            console.log(data[i]);
        }

        const result3 = trie.prefixOf("are", data);
        expect(result3).toContain("31");
        for (const i of result3) {
            console.log(data[i]);
        }
    });
});

