import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db, storage } from "@/firebase/firebaseConfig";
import { StorageReference, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Entry, useTiwiListContext } from "@/contexts/TiwiContext";

export type SaveRecReturn = {
    status: boolean;
    filePath?: string;
};

type DataDetail = {
    tiwi?: string | null;
    gTiwi?: string | null;
    english?: string | null;
    gEnglish?: string | null;
    recordingURI?: string | null;
    topic?: string | null;
};

export default function useCRUD() {
    const data = useTiwiListContext();

    // add recording to existing sentence
    async function saveRecording(uri: string, id: string): Promise<SaveRecReturn> {
        try {
            // todo better error handling
            if (!data) {
                throw new Error("Failed to get data on saveRecording()");
            }

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

                await uploadBytes(fileRef, fileBlob);

                downloadURL = await getDownloadURL(fileRef);
                if (!downloadURL) {
                    throw new Error("Failed to get download url of recording");
                }
            } catch (err) {
                console.error("Failed to save audio to firebase", err);
                return { status: false };
            }

            const saveStatus = await updateSentenceData(
                id,
                { recordingURI: downloadURL },
                data[id]
            );
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
    async function saveDetails(
        id: string,
        { tiwi, gTiwi, english, gEnglish, topic, recordingURI }: DataDetail
    ) {
        try {
            // todo better error handling
            if (!data) {
                throw new Error("Failed to get data on saveDetails()");
            }

            const saveStatus = await updateSentenceData(
                id,
                {
                    tiwi: tiwi ?? undefined,
                    gTiwi: gTiwi ?? undefined,
                    english: english ?? undefined,
                    gEnglish: gEnglish ?? undefined,
                    topic: topic ?? undefined,
                    recordingURI: recordingURI ?? undefined,
                },
                data[id]
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
            const newSentenceData: { [key: string]: string } = {};

            if (tiwi) {
                newSentenceData["Tiwi"] = tiwi;
            }

            if (gTiwi) {
                newSentenceData["Gloss (tiwi)"] = gTiwi;
            }

            if (english) {
                newSentenceData["English"] = english;
            }
            if (gEnglish) {
                newSentenceData["Gloss (english)"] = gEnglish;
            }
            if (topic) {
                newSentenceData["Topic"] = topic;
            }

            const docRef = await addDoc(collection(db, "sentences"), newSentenceData);

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
async function updateSentenceData(
    id: string,
    updatedData: DataDetail,
    current: Entry
): Promise<SaveRecReturn> {
    try {
        const tiwiID = doc(db, "sentences", id);

        const updateFields: { [key: string]: string | null } = {};

        if (updatedData.tiwi !== undefined && updatedData.tiwi !== current.Tiwi) {
            updateFields["Tiwi"] = updatedData.tiwi;
        }
        if (updatedData.gTiwi !== undefined && updatedData.gTiwi !== current["Gloss (tiwi)"]) {
            updateFields["Gloss (tiwi)"] = updatedData.gTiwi;
        }
        if (updatedData.english !== undefined && updatedData.english !== current.English) {
            updateFields["English"] = updatedData.english;
        }
        if (updatedData.gEnglish !== undefined && updatedData.gEnglish !== current["Gloss (english)"]) {
            updateFields["Gloss (english)"] = updatedData.gEnglish;
        }
        if (updatedData.topic !== undefined && updatedData.topic !== current.Topic) {
            updateFields["Topic"] = updatedData.topic;
        }
        if (updatedData.recordingURI !== undefined && updatedData.recordingURI !== current.recording) {
            updateFields["recording"] = updatedData.recordingURI;
        }
        if (Object.keys(updateFields).length > 0) {
            await updateDoc(tiwiID, updateFields);
        }

        // small delay
        await new Promise((resolve) => setTimeout(resolve, 100));

        return { status: true }; // todo check what this does potential foot gun filePath: fileUri };
    } catch (err) {
        console.error("Failed to save data to firebase", err);
        return { status: false };
    }
}
