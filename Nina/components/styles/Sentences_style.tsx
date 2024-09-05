import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    sentences_container: {
        flex: 1,
        padding: 20,
    },
    sentenceContainer: {
        padding: 20,
        backgroundColor: 'pink',
        borderRadius: 10,
        marginBottom: 20,
    },
    txt: {
        fontSize: 15,
        margin: 5,
    },
    recordingContainer: {
        backgroundColor: 'lightgrey',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
export default styles;