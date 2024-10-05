import * as FileSystem from "expo-file-system";
import { DataType, Entry, useUpdateData } from "@/contexts/TiwiContext";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

export type SaveRecReturn = {
    status: boolean;
    filePath?: string;
};

type DataDetail = {
    tiwi?: string;
    gTiwi?: string;
    english?: string;
    gEnglish?: string;
    recordingURI?: string;
    topic?: string;
};

export default function useCRUD() {
    const update = useUpdateData();

    // add recording to existing sentence
    async function saveRecording(uri: string, id: string): Promise<SaveRecReturn> {
        try {
            const fileName = uri.split("/").pop();
            if (!fileName) {
                console.error("filename does not exist");
                return { status: false };
            }

            const filePath = FileSystem.documentDirectory + fileName;

            try {
                await FileSystem.moveAsync({
                    from: uri,
                    to: filePath,
                });
            } catch (err) {
                console.error("Failed to save recording to local storage", err);
                return { status: false };
            }

            const saveStatus = await saveJsonFile(id, { recordingURI: fileName }, update);
            if (!saveStatus.status) {
                throw new Error("Failed to save recording details to json in local storage");
            }

            return { status: true, filePath: filePath };
        } catch (err) {
            console.error("Failed to save", err);
            return { status: false };
        }
    }

    // save other details
    async function saveDetails(id: string, { tiwi, gTiwi, english, gEnglish, topic }: DataDetail) {
        try {
            const saveStatus = await saveJsonFile(
                id,
                { tiwi: tiwi, gTiwi: gTiwi, english: english, gEnglish: gEnglish, topic: topic },
                update
            );

            if (!saveStatus) {
                throw new Error("Failed to save sentence details");
            }

            return true;
        } catch (err) {
            console.error("Failed to save sentence details", err);
            return false;
        }
    }

    async function addDetails({ tiwi, gTiwi, english, gEnglish, topic }: DataDetail) {
        try {
            const docRef = await addDoc(collection(db, "sentences"), {
                English: english,
                Tiwi: tiwi,
                Topic: topic,
                "Gloss (english)": gEnglish,
                "Gloss (tiwi)": gTiwi,
                "Image name (optional)": null,
                recording: null,
                completed: false,
            });

            // small delay
            await new Promise((resolve) => setTimeout(resolve, 100));
            update();

            return { status: true, currentID: docRef };
        } catch (err) {
            console.error("Failed to save sentence to database:", err);
            return { status: false };
        }
    }

    return { saveRecording, saveDetails, addDetails };
}

// rewrite the actual json data
async function saveJsonFile(
    id: string,
    updatedData: DataDetail,
    updateData: () => void
): Promise<SaveRecReturn> {
    try {
        const tiwiID = doc(db, "sentences", id);

        if (updatedData.tiwi) {
            await updateDoc(tiwiID, {
                Tiwi: updatedData.tiwi,
            });
        }
        if (updatedData.gTiwi) {
            await updateDoc(tiwiID, {
                "Gloss (tiwi)": updatedData.gTiwi,
            });
        }
        if (updatedData.english) {
            await updateDoc(tiwiID, {
                English: updatedData.gTiwi,
            });
        }
        if (updatedData.gEnglish) {
            await updateDoc(tiwiID, {
                "Gloss (english)": updatedData.gTiwi,
            });
        }
        if (updatedData.topic) {
            await updateDoc(tiwiID, {
                Topic: updatedData.gTiwi,
            });
        }
        if (updatedData.recordingURI) {
            await updateDoc(tiwiID, {
                Recording: updatedData.gTiwi,
            });
        }

        // small delay
        await new Promise((resolve) => setTimeout(resolve, 100));
        updateData();

        return { status: true }; // todo check what this does potential foot gun filePath: fileUri };
    } catch (err) {
        console.error("Failed to save data to firebase", err);
        return { status: false };
    }
}
