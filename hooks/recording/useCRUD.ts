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
}

export default function useCRUD() {
    const update = useUpdateData()

    // add recording to existing sentence
    async function saveRecording(uri: string, id: number): Promise<SaveRecReturn> {
        try {
            const fileName = uri.split('/').pop();
            let filePath;

            if (fileName) {
                filePath = FileSystem.documentDirectory + fileName;
            } else {
                console.error('filename does not exist')
                return { status: false };
            }

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
    async function saveDetails(id: number, { dharug, gDharug, english, gEnglish }: DataDetail) {
        try {
            const saveStatus = await saveJsonFile(id,
                { dharug: dharug, gDharug: gDharug, english: english, gEnglish: gEnglish }, update);

            if (!saveStatus) {
                throw new Error('Failed to save sentence details');
            }

            return true; 

        } catch (err) {
            console.error('Failed to save sentence details', err);
            return false;
        }
    }

    return { saveRecording, saveDetails };
}

// rewrite the actual json data
async function saveJsonFile(id: number, updatedData: DataDetail, updateData: () => void): Promise<SaveRecReturn> {
    const { loadJson } = useData();
    try {
        const fileUri = FileSystem.documentDirectory + 'dharug_list.json';
        let jsonData: DataType[] = await loadJson();

        if (jsonData) {
            const dharug = jsonData.find(item => item.id === id);
            if (dharug) {
                if (updatedData.dharug) {
                    dharug.Dharug = updatedData.dharug;
                }

                if (updatedData.gDharug) {
                    dharug['Dharug(Gloss)'] = updatedData.gDharug;
                }

                if (updatedData.english) {
                    dharug.English = updatedData.english;
                }

                if (updatedData.gEnglish) {
                    dharug['Gloss (english)'] = updatedData.gEnglish;
                }

                if (updatedData.recordingURI) {
                    dharug.recording = updatedData.recordingURI;
                }

                // write update json data
                FileSystem.writeAsStringAsync(fileUri, JSON.stringify(jsonData));

                // small delay
                await new Promise(resolve => setTimeout(resolve, 100));
                updateData()
            } else {
                console.error('Dharug data is undefined')
                return { status: false };
            }

        } else {
            console.error('Json data does not exists')
            return { status: false };
        }

        return { status: true, filePath: fileUri };
    } catch (err) {
        console.error('Failed to save json file', err);
        return { status: false };
    }
}

