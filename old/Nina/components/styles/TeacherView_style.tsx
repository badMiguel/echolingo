import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    teacher_container: {
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
        fontSize: 20,
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
    checkBox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#000',
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: 'white',
    },
    checked: {
        backgroundColor: 'blue',  // Checked state styling
    },
    chosenLabel: {
        color: 'green',
    },
});
export default styles;