import * as FileSystem from 'expo-file-system';
import * as Asset from 'expo-asset';
import { DataType } from '@/contexts/DharugContext';

export default function useCRUD() {

    async function save(uri: string, id: number) {
        const fileName = uri.split('/').pop();
        let filePath;

        if (fileName) {
            filePath = FileSystem.documentDirectory + fileName;
        } else {
            console.error('filename does not exist')
            return false;
        }

        try {
            await FileSystem.moveAsync({
                from: uri,
                to: filePath,
            })
        } catch (err) {
            console.error('Failed to save recording to local storage', err);
            return false;
        }

        const saveStatus = await saveJsonFile(id, fileName);
        if (!saveStatus) {
            console.error('Failed to save json data to local storage')
            return false;
        }

        return true;
    }

    async function saveJsonFile(id: number, recordingURI: string) {
        const fileUri = FileSystem.documentDirectory + 'dharug_list.json';
        const fileInfo = await FileSystem.getInfoAsync(fileUri);

        // dharug_list does not exist on user device
        if (!fileInfo.exists) {
            const copyStatus = await copyJsonData();

            if (!copyStatus) {
                console.error('Failed to copy json');
                return false;
            }
        }

        let jsonData: DataType[] = await loadJsonData();

        if (jsonData) {
            const dharug = jsonData.find(item => item.id === id);
            if (dharug) {
                dharug.recording = recordingURI;
            } else {
                console.error('Dharug data is undefined')
                return false;
            }
        } else {
            console.error('Json data does not exists')
            return false;
        }

        return true;
    }

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

    async function copyJsonData() {
        const data = Asset.Asset.fromModule(require('@/data/json/dharug_list.json'));
        await data.downloadAsync();

        const sourceUri = data.localUri;
        const targetUri = FileSystem.documentDirectory + 'dharug_list.json';

        try {
            if (sourceUri) {
                await FileSystem.copyAsync({
                    from: sourceUri,
                    to: targetUri,
                })
            } else {
                throw new Error('sourceUri is null');
            }
        } catch (err) {
            console.error('Failed to copy dharug data', err);
            return false
        }

        return true;
    }

    return { save };
}
