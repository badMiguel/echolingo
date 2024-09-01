import * as FileSystem from 'expo-file-system';
import { DataType, useUpdateData } from '@/contexts/DharugContext';
import useData from './useData';

type SaveRecReturn = {
    status: boolean;
    filePath?: string;
}

type DataDetail = {
    dharug?: string;
    gDharug?: string;
    english?: string;
    gEnglish?: string;
    recordingURI?: string;
    topic?: string;
}

export default function useCRUD() {
    const update = useUpdateData()

    // add recording to existing sentence
    async function saveRecording(uri: string, id: number): Promise<SaveRecReturn> {
        try {
            const fileName = uri.split('/').pop();
            if (!fileName) {
                console.error('filename does not exist')
                return { status: false };
            }

            const filePath = FileSystem.documentDirectory + fileName;

            try {
                await FileSystem.moveAsync({
                    from: uri,
                    to: filePath,
                })
            } catch (err) {
                console.error('Failed to save recording to local storage', err);
                return { status: false };
            }

            const saveStatus = await saveJsonFile(id, { recordingURI: fileName }, update);
            if (!saveStatus.status) {
                throw new Error('Failed to save recording details to json in local storage')
            }

            return { status: true, filePath: filePath };
        } catch (err) {
            console.error('Failed to save', err);
            return { status: false };
        }
    }

    // save other details
    async function saveDetails(id: number, { dharug, gDharug, english, gEnglish, topic }: DataDetail) {
        try {
            const saveStatus = await saveJsonFile(id,
                { dharug: dharug, gDharug: gDharug, english: english, gEnglish: gEnglish, topic: topic }, update);

            if (!saveStatus) {
                throw new Error('Failed to save sentence details');
            }

            return true;

        } catch (err) {
            console.error('Failed to save sentence details', err);
            return false;
        }
    }

    async function addDetails({ dharug, gDharug, english, gEnglish, topic }: DataDetail) {
        const { loadJson } = useData();
        try {
            const fileUri = FileSystem.documentDirectory + 'dharug_list.json';
            let jsonData: DataType[] = await loadJson();

            if (!jsonData) {
                throw new Error('Json data does not exists')
            }
            const newID = jsonData.length + 1;
            const newData: DataType = {
                id: newID,
                English: english ? english : null,
                "Gloss (english)": gEnglish ? gEnglish : null,
                "Dharug(Gloss)": gDharug ? gDharug : null,
                Dharug: dharug ? dharug : null,
                Topic: topic ? topic : null,
                "Image Name (optional)": null,
                recording: null,
                completed: false,
            }
            jsonData.push(newData);

            // write update json data
            FileSystem.writeAsStringAsync(fileUri, JSON.stringify(jsonData));

            // small delay
            await new Promise(resolve => setTimeout(resolve, 100));
            update()

            return { status: true, currentID: newID };
        } catch (err) {
            console.error('Failed to save json file', err);
            return { status: false };
        }
    }

    return { saveRecording, saveDetails, addDetails };
}

// rewrite the actual json data
async function saveJsonFile(id: number, updatedData: DataDetail, updateData: () => void): Promise<SaveRecReturn> {
    const { loadJson } = useData();
    try {
        const fileUri = FileSystem.documentDirectory + 'dharug_list.json';
        let jsonData: DataType[] = await loadJson();

        if (!jsonData) {
            console.error('Json data does not exists')
            return { status: false };
        }

        const dharug = jsonData.find(item => item.id === id);
        if (!dharug) {
            console.error('Dharug data is undefined')
            return { status: false };
        }

        if (updatedData.dharug) { dharug.Dharug = updatedData.dharug }
        if (updatedData.gDharug) { dharug['Dharug(Gloss)'] = updatedData.gDharug }
        if (updatedData.english) { dharug.English = updatedData.english }
        if (updatedData.gEnglish) { dharug['Gloss (english)'] = updatedData.gEnglish }
        if (updatedData.topic) { dharug.Topic = updatedData.topic }
        if (updatedData.recordingURI) { dharug.recording = updatedData.recordingURI }

        // write update json data
        FileSystem.writeAsStringAsync(fileUri, JSON.stringify(jsonData));

        // small delay
        await new Promise(resolve => setTimeout(resolve, 100));
        updateData()

        return { status: true, filePath: fileUri };
    } catch (err) {
        console.error('Failed to save json file', err);
        return { status: false };
    }
}

