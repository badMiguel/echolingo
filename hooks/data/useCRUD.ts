import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db, storage } from "@/firebase/firebaseConfig";
import { StorageReference, getDownloadURL, ref, uploadBytes } from "firebase/storage";

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
    // add recording to existing sentence
    async function saveRecording(uri: string, id: string): Promise<SaveRecReturn> {
        try {
            const response = await fetch(uri);
            const fileBlob = await response.blob();

            const filePath = `recording/${id}`;
            let fileRef: StorageReference;
            let downloadURL: string;

            try {
                // todo make fallback e.g. get ref again up to 3 times
                fileRef = ref(storage, filePath);
                if (!fileRef) {
                    throw new Error("Failed to get reference for recording");
                }

                downloadURL = await getDownloadURL(fileRef);
                if (!downloadURL) {
                    throw new Error("Failed to get download url of recording");
                }

                await uploadBytes(fileRef, fileBlob);
            } catch (err) {
                console.error("Failed to save audio to firebase", err);
                return { status: false };
            }

            const saveStatus = await updateSentenceData(id, { recordingURI: downloadURL });
            if (!saveStatus.status) {
                throw new Error("Failed to save recording details to firebase");
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
            const saveStatus = await updateSentenceData(id, {
                tiwi: tiwi,
                gTiwi: gTiwi,
                english: english,
                gEnglish: gEnglish,
                topic: topic,
            });

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

            return { status: true, currentID: docRef.id };
        } catch (err) {
            console.error("Failed to save sentence to database:", err);
            return { status: false };
        }
    }

    return { saveRecording, saveDetails, addDetails };
}

// rewrite the actual json data
async function updateSentenceData(id: string, updatedData: DataDetail): Promise<SaveRecReturn> {
    try {
        const tiwiID = doc(db, "sentences", id);

        const updateFields: { [key: string]: string } = {};

        if (updatedData.tiwi) {
            updateFields["Tiwi"] = updatedData.tiwi;
        }

        if (updatedData.gTiwi) {
            updateFields["Gloss (tiwi)"] = updatedData.gTiwi;
        }

        if (updatedData.english) {
            updateFields["English"] = updatedData.english;
        }
        if (updatedData.gEnglish) {
            updateFields["Gloss (english)"] = updatedData.gEnglish;
        }
        if (updatedData.topic) {
            updateFields["Topic"] = updatedData.topic;
        }
        if (updatedData.recordingURI) {
            updateFields["Recording"] = updatedData.recordingURI;
        }

        if (Object.keys(updateFields).length > 0) {
            await updateDoc(tiwiID, { updateFields });
        }

        // small delay
        await new Promise((resolve) => setTimeout(resolve, 100));

        return { status: true }; // todo check what this does potential foot gun filePath: fileUri };
    } catch (err) {
        console.error("Failed to save data to firebase", err);
        return { status: false };
    }
}
