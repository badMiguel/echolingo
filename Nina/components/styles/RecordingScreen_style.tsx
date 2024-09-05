import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    recordingContainer: {
        backgroundColor: 'lightgrey',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        padding: 20,
    },
    headings: {
        fontSize: 20,
        fontWeight: 'bold',
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
        marginRight: 10,
        backgroundColor: 'white',
    },
    checked: {
        backgroundColor: 'blue',  // Checked state styling
    },
    chosenLabel: {
        color: 'green',
        marginLeft: 10,
    },
    txt: {
        fontSize: 15,
        margin: 5,
    },
});

export default styles;