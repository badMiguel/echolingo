import { Button, FlatList, SectionList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { DataType, emptyDharugData, useSetDharugContext } from '@/contexts/DharugContext'
import { router } from 'expo-router'
import data from '@/data/json/dharug_list.json'

const RecordingList = () => {

    const recorded: DataType[] = data.filter(item => item.recording);
    const notRecorded: DataType[] = data.filter(item => !item.recording);

    const sections = [
        {
            title: "Not yet recorded",
            data: notRecorded.length > 0 ? notRecorded : [emptyDharugData()]
        }, {
            title: "With recordings",
            data: recorded.length > 0 ? recorded : [emptyDharugData()]
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

const SentenceCard: React.FC<{ dharug: DataType, finished: boolean }> = ({ dharug, finished }) => {
    const goToSentence = () => {
        router.push({
            pathname: '/(addRecording)',
            params: {
                sentenceID: dharug.id,
            },
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
