import { Button, SectionList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DataType, emptyDharugData, useDharugListContext } from '@/contexts/DharugContext'
import { router } from 'expo-router'

const RecordingList = () => {
    const [dataRecorded, setDataRecorded] = useState<DataType[]>([]);
    const [dataNotRecorded, setDataNotRecorded] = useState<DataType[]>([]);
    const data = useDharugListContext();

    useEffect(() => {
        if (data) {
            const recorded = data.filter(item => item.recording);
            const notRecorded = data.filter(item => !item.recording);

            setDataRecorded(recorded);
            setDataNotRecorded(notRecorded);
        }
    }, []);

    useEffect(() => {
        if (data) {
            const recorded = data.filter(item => item.recording);
            const notRecorded = data.filter(item => !item.recording);

            setDataRecorded(recorded);
            setDataNotRecorded(notRecorded);
        }
    }, [data]);

    const sections = [
        {
            title: "Not yet recorded",
            data: dataNotRecorded.length > 0 ? dataNotRecorded : [emptyDharugData()]
        }, {
            title: "With recordings",
            data: dataRecorded.length > 0 ? dataRecorded : [emptyDharugData()]
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
