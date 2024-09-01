import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
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
        const fileInfo = await FileSystem.getInfoAsync(fileUri);

        console.log('fileInfo', fileInfo)
        // dharug_list does not exist on user device
        if (!fileInfo.exists) {
            console.log('does not exist')
            const copyStatus = await copyJsonData();

            if (!copyStatus) {
                console.error('Failed to copy json');
                return { status: false };
            }
        }

        let jsonData: DataType[] = await loadJsonData();

        if (jsonData) {
            console.log('id', id)
            const dharug = jsonData.find(item => item.id === id);
            console.log('dharug', dharug)
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

// save the dharug data to user's local storage
async function copyJsonData() {
    try {
        // for production. get dharug json from build data 
        // const data = Asset.fromModule(require('@/data/json/dharug_list.json'));
        // await data.downloadAsync();
        // const sourceUri = data.localUri;
        const targetUri = FileSystem.documentDirectory + 'dharug_list.json';
        //
        // try {
        //     if (sourceUri) {
        //         await FileSystem.copyAsync({
        //             from: sourceUri,
        //             to: targetUri,
        //         })
        //     } else {
        //         throw new Error('sourceUri is null');
        //     }
        // } catch (err) {
        //     console.error('Failed to copy dharug data', err);
        //     return false
        // }
        await FileSystem.writeAsStringAsync(targetUri, JSON.stringify(data));
        return true;

    } catch (err) {
        console.error('Failed to copy json data', err);
        return false;
    }
}

