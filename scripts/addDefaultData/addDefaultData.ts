import { db } from "../../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import data from "../../data/json/tiwi_list.json";

// save default data in json to firebase
// run: ts-node addDefaultData.ts
async function addDefaultData() {
    console.log("Inserting Sentence Data");
    try {
        for (const item of data) {
            const docRef = await addDoc(collection(db, "sentences"), {
                English: item.English,
                Tiwi: item.Tiwi,
                Topic: item.Topic,
                "Gloss (english)": item["Gloss (english)"],
                "Gloss (tiwi)": item["Gloss (tiwi)"],
                "Image name (optional)": item["Image name (optional)"],
                recording: item.recording,
                completed: item.completed,
            });

            console.log(`Added item with ref: ${docRef.id}`);
        }

        console.log("Successfully added all data");
        process.exit(0);
    } catch (error) {
        console.error("Error adding default data:", error);
        process.exit(1);
    }
}

addDefaultData();
