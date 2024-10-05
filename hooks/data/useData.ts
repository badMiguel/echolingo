export default function useData() {
    async function loadJson() {
        try {
        } catch (err) {
            console.error("Error loading data", err);
            return false;
        }
    }

    return { loadJson };
}
