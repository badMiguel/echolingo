import { Button, FlatList, SectionList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { DataType, emptyDharugData, useDharugListContext } from '@/contexts/DharugContext'
import { router } from 'expo-router'

const RecordingList = () => {
    const data = useDharugListContext();

    let recorded: DataType[] = [];
    let notRecorded: DataType[] = [];

    if (data) {
        recorded = data.filter(item => item.recording);
        notRecorded = data.filter(item => !item.recording);
    }

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
                        <Text style={{}}>All sentences have been recorded</Text>
                    ) : (
                        <Text style={{}}>No sentences recorded yet</Text>
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
