import { db } from "../../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import data from "../../data/json/category_data.json";

// save default data in json to firebase
// run: ts-node addDefaultCategory.ts
async function addDefaultData() {
    console.log("Inserting Category Data");
    try {
        for (const item of data) {
            const docRef = await addDoc(collection(db, "category"), {
                categoryNum: item.categoryNum,
                categoryName: item.categoryName,
                completed: item.completed,
                topic: item.topic,
            });

            console.log(`Added category with ref: ${docRef.id}`);
        }

        console.log("Successfully added all category data");
        process.exit(0);
    } catch (error) {
        console.error("Error adding default category data:", error);
        process.exit(1);
    }
}

addDefaultData();
