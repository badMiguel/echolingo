import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'

import { DataType, useDharugListContext } from '@/contexts/DharugContext';
import useCRUD from '@/hooks/recording/useCRUD';
import { NavigationProp } from '@react-navigation/native';

export default function Add() {
    const [dharugList, setDharugList] = useState<DataType[] | undefined>();
    const [currentID, setCurrentID] = useState<number>();
    const [current, setCurrent] = useState<DataType | undefined>();

    const { sentenceID } = useLocalSearchParams();
    const data = useDharugListContext();

    useEffect(() => {
        if (dharugList) {  // todo error handling
            const id: number = Array.isArray(sentenceID) ? parseInt(sentenceID[0]) : parseInt(sentenceID);
            const item: DataType | undefined = dharugList.find(item => item.id === id);

            setCurrentID(id);
            setCurrent(item);
        }
    }, [sentenceID]);

    useEffect(() => {
        setDharugList(data);
    }, [data])

    useEffect(() => {
    }, [])

    return (
        <View>
            <AddDetails current={current} />
            {currentID ? (
                <>
                    <AddRecording currentID={currentID} />
                    <Button title='Back' onPress={() => router.navigate('/(recordingList)')} />
                </>
            ) : null}
        </View>
    )
}

const AddDetails: React.FC<{ current: DataType | undefined }> = ({ current }) => {
    const [dharug, setDharug] = useState<string | undefined>();
    const [dharugGloss, setDharugGloss] = useState<string | undefined>();
    const [english, setEnglish] = useState<string | undefined>();
    const [englishGloss, setEnglishGloss] = useState<string | undefined>();
    const [topic, setTopic] = useState<string | undefined>();

    const { saveDetails, addDetails } = useCRUD();

    useEffect(() => {
        if (current) {
            current.Dharug && setDharug(current.Dharug);
            current['Dharug(Gloss)'] && setDharugGloss(current['Dharug(Gloss)']);
            current.English && setEnglish(current.English);
            current['Gloss (english)'] && setEnglishGloss(current['Gloss (english)']);
            current.Topic && setEnglishGloss(current.Topic);
        } else {
            setDharug(undefined);
            setDharugGloss(undefined);
            setEnglish(undefined);
            setEnglishGloss(undefined);
            setTopic(undefined);
        }
    }, [current]);

    // todo add validation and error handling
    const updateDetails = async () => {
        try {
            if (!current) {
                const { status, currentID } = await addDetails(
                    { dharug: dharug, gDharug: dharugGloss, english: english, gEnglish: englishGloss, topic: topic })
                if (!status) {
                    throw new Error('Failed to create new data');
                }
            } else {
                await saveDetails(current.id, { dharug: dharug, gDharug: dharugGloss, english: english, gEnglish: englishGloss, topic: topic });
            }
        } catch (err) {
            console.error('Failed to create new data', err);
        }
    }

    return (
        <View>
            <Text>Dharug</Text>
            <TextInput
                value={dharug}
                onChangeText={(text) => setDharug(text)}
            />

            <Text>Dharug (Gloss)</Text>
            <TextInput
                value={dharugGloss}
                onChangeText={(text) => setDharugGloss(text)}
            />

            <Text>English</Text>
            <TextInput
                value={english}
                onChangeText={(text) => setEnglish(text)}
            />

            <Text>English Gloss</Text>
            <TextInput
                value={englishGloss}
                onChangeText={(text) => setEnglishGloss(text)}
            />

            <Text>Topic</Text>
            <TextInput
                value={topic}
                onChangeText={(text) => setEnglishGloss(text)}
            />
            <Button
                title={current?.id ? 'Update' : 'Add'}
                onPress={() => updateDetails()}
            />
        </View>
    );
}

function AddRecording({ currentID }: { currentID: number | undefined }) {
    const record = () => {
        router.push({
            pathname: '/record',
            params: {
                current: currentID ? currentID : undefined
            }
        });
    }

    const upload = () => {
        router.push({
            pathname: '/upload',
            params: {
                current: currentID ? currentID : undefined
            }
        });
    }

    return (
        <View>
            <Button title='Record Now' onPress={() => record()} />
            <Button title='Upload From Device' onPress={() => upload()} />
        </View>
    );
}

const styles = StyleSheet.create({})
