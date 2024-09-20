import * as FileSystem from 'expo-file-system';

// load the data from local storage
export default function useData() {
    async function loadJson() {
        try {
            const fileUri = FileSystem.documentDirectory + 'tiwi_list.json';
            const fileContents = await FileSystem.readAsStringAsync(fileUri);
            const jsonData = JSON.parse(fileContents);
            return jsonData;
        } catch (err) {
            console.error('Error loading json file', err);
            return false;
        }
    }

    return { loadJson };
}
