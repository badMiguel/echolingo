import * as FileSystem from "expo-file-system";
import { DataType, Entry, useUpdateData } from "@/contexts/TiwiContext";
import useData from "./useData";

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
    async function saveRecording(uri: string, id: number): Promise<SaveRecReturn> {
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
    async function saveDetails(id: number, { tiwi, gTiwi, english, gEnglish, topic }: DataDetail) {
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
        const { loadJson } = useData();
        try {
            const fileUri = FileSystem.documentDirectory + "tiwi_list.json";
            let jsonData: DataType = await loadJson();

            if (!jsonData) {
                throw new Error("Json data does not exists");
            }
            const newID = Object.keys(jsonData).length + 1;
            const newData: Entry = {
                English: english ? english : "",
                "Gloss (english)": gEnglish ? gEnglish : null,
                "Gloss (tiwi)": gTiwi ? gTiwi : null,
                Tiwi: tiwi ? tiwi : "",
                Topic: topic ? topic : "",
                "Image name (optional)": null,
                recording: null,
                completed: false,
            };

            jsonData[newID] = newData;

            // write update json data
            FileSystem.writeAsStringAsync(fileUri, JSON.stringify(jsonData));

            // small delay
            await new Promise((resolve) => setTimeout(resolve, 100));
            update();

            return { status: true, currentID: newID };
        } catch (err) {
            console.error("Failed to save json file", err);
            return { status: false };
        }
    }

    return { saveRecording, saveDetails, addDetails };
}

// rewrite the actual json data
async function saveJsonFile(
    id: number,
    updatedData: DataDetail,
    updateData: () => void
): Promise<SaveRecReturn> {
    const { loadJson } = useData();
    try {
        const fileUri = FileSystem.documentDirectory + "tiwi_list.json";
        let jsonData: DataType = await loadJson();

        if (!jsonData) {
            console.error("Json data does not exists");
            return { status: false };
        }

        const tiwi = jsonData[id];
        if (!tiwi) {
            console.error("Tiwi data is undefined");
            return { status: false };
        }

        if (updatedData.tiwi) {
            tiwi.Tiwi = updatedData.tiwi;
        }
        if (updatedData.gTiwi) {
            tiwi["Gloss (tiwi)"] = updatedData.gTiwi;
        }
        if (updatedData.english) {
            tiwi.English = updatedData.english;
        }
        if (updatedData.gEnglish) {
            tiwi["Gloss (english)"] = updatedData.gEnglish;
        }
        if (updatedData.topic) {
            tiwi.Topic = updatedData.topic;
        }
        if (updatedData.recordingURI) {
            tiwi.recording = updatedData.recordingURI;
        }

        // write update json data
        FileSystem.writeAsStringAsync(fileUri, JSON.stringify(jsonData));

        // small delay
        await new Promise((resolve) => setTimeout(resolve, 100));
        updateData();

        return { status: true, filePath: fileUri };
    } catch (err) {
        console.error("Failed to save json file", err);
        return { status: false };
    }
}
