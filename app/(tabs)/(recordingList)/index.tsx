import { Button, FlatList, SectionList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { DharugDataType, useSetDharugContextID } from '@/contexts/DharugContext'
import { router } from 'expo-router'
import data from '@/data/json/dharug_list.json'

const RecordingList = () => {

    const recorded: DharugDataType[] = data.filter(item => item.recording);
    const notRecorded: DharugDataType[] = data.filter(item => !item.recording);

    const empty = () => {
        return {
            id: 0,
            English: null,
            "Gloss (english)": null,
            "Dharug(Gloss)": null,
            Dharug: null,
            Topic: null,
            "Image Name (optional)": null,
            recording: null,
            completed: false,
        }
    }

    const sections = [
        {
            title: "Not yet recorded",
            data: notRecorded.length > 0 ? notRecorded : [empty()]
        }, {
            title: "With recordings",
            data: recorded.length > 0 ? recorded : [empty()]
        }];

    return (
        <SectionList
            sections={sections}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) =>
                item.id === 0 ? (
                    !item.completed ? (
                        <Text style={{}}>Congratulations! You have finished courses currently available.</Text>
                    ) : (
                        <Text style={{}}>You currently have not finished any course yet.</Text>
                    )
                ) : (
                    <SentenceCard dharug={item} finished={false} />
                )
            }
            renderSectionHeader={({ section: { title } }) => (
                <Text style={{}}>{title}</Text>
            )}
            style={{}}
        />
    )
}

const SentenceCard: React.FC<{ dharug: DharugDataType, finished: boolean }> = ({ dharug, finished }) => {
    const setCurrentID = useSetDharugContextID();

    const goToSentence = () => {
        setCurrentID(dharug.id);

        router.push({
            pathname: '/(recordingList)'
        });
    }

    return (
        <View>
            <Text> {dharug.id}</Text>
            <Text>{dharug.Dharug || dharug['Dharug(Gloss)']}</Text>
            <Text>{dharug.English || dharug['Gloss (english)']}</Text>
            <Button
                title='Make Recording'
                onPress={() => goToSentence()}
            />
        </View>
    );
}

export default RecordingList

const styles = StyleSheet.create({})
