import * as FileSystem from 'expo-file-system';
import { DataType } from '@/contexts/DharugContext';
import data from '@/data/json/dharug_list.json';

type SaveType = {
    status: boolean;
    filePath?: string;
}

export default function useCRUD() {

    // add recording to existing sentence
    async function save(uri: string, id: number): Promise<SaveType> {
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

            const saveStatus = await saveJsonFile(id, fileName);
            if (!saveStatus.status) {
                console.error('Failed to save json data to local storage')
                return { status: false };
            }

            return { status: true, filePath: filePath };
        } catch (err) {
            console.error('Failed to save', err);
            return { status: false };
        }
    }

    return { save };
}

// save json data with recording
async function saveJsonFile(id: number, recordingURI: string): Promise<SaveType> {
    try {
        const fileUri = FileSystem.documentDirectory + 'dharug_list.json';
        let jsonData: DataType[] = await loadJsonData();

        if (jsonData) {
            const dharug = jsonData.find(item => item.id === id);
            if (dharug) {
                dharug.recording = recordingURI;
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

// load the data from local storage
async function loadJsonData() {
    try {
        const fileUri = FileSystem.documentDirectory + 'dharug_list.json';
        const fileContents = await FileSystem.readAsStringAsync(fileUri);
        const jsonData = JSON.parse(fileContents);
        return jsonData;
    } catch (err) {
        console.error('Error loading json file', err);
        return false;
    }
}
