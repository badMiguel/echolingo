import { db } from "@/firebase/firebaseConfig";
import {
    collection,
    addDoc,
    getDocs,
    doc,
    deleteDoc,
    query,
    where,
    updateDoc,
} from "firebase/firestore";

export async function addDataTest() {
    try {
        const docRef = await addDoc(collection(db, "test"), {
            test: "yes",
            test2: 5,
        });

        console.log("Document written with ID:", docRef.id);
        console.log("write data success");
    } catch (err) {
        console.error("failed writing data", err);
    }
}

export async function readDataTest() {
    try {
        const data = await getDocs(collection(db, "test"));

        data.forEach((element) => {
            console.log(element.data());
        });

        console.log("read data success");
    } catch (err) {
        console.error("failed reading data", err);
    }
}

export async function updateDataTest() {
    const testID = collection(db, "test");
    const q = query(testID, where("test2", "==", 5));
    const querySnapshot = await getDocs(q);
    try {
        querySnapshot.forEach(async (item) => {
            const testRef = doc(db, "test", item.id);

            await updateDoc(testRef, {
                test2: 10,
            });
        });
        console.log("success modifying");
    } catch (err) {
        console.error("failed modifying data", err);
    }
}

export async function deleteDataTest() {
    const testID = collection(db, "test");
    const q = query(testID, where("test", "==", "yes"));
    const querySnapshot = await getDocs(q);
    try {
        querySnapshot.forEach(async (item) => {
            const dataDocRef = doc(db, "test", item.id);
            await deleteDoc(dataDocRef);
        });
        console.log("success deleting");
    } catch (err) {
        console.error("failed deleting data", err);
    }
}
