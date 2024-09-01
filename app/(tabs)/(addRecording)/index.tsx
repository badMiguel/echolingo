import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'

import { DataType, useDharugListContext } from '@/contexts/DharugContext';
import useCRUD from '@/hooks/recording/useCRUD';

export default function Add() {
    const [dharugList, setDharugList] = useState<DataType[] | undefined>(undefined);
    const data = useDharugListContext();

    useEffect(() => {
        setDharugList(data);
    }, [data])

    let currentID: number = 0;
    let current: DataType | undefined

    const { sentenceID } = useLocalSearchParams();
    if (dharugList) {
        currentID = Array.isArray(sentenceID) ? parseInt(sentenceID[0]) : parseInt(sentenceID);
        current = dharugList.find(item => item.id === currentID);
    }

    return (
        <View>
            <AddDetails current={current} />
            < AddRecording currentID={currentID} />
            {currentID
                ? <Button title='Back' onPress={() => router.navigate('/(recordingList)')} />
                : null
            }
        </View>
    )
}

const AddDetails: React.FC<{ current: DataType | undefined }> = ({ current }) => {
    const [dharug, setDharug] = useState<string | undefined>();
    const [dharugGloss, setDharugGloss] = useState<string | undefined>();
    const [english, setEnglish] = useState<string | undefined>();
    const [englishGloss, setEnglishGloss] = useState<string | undefined>();

    const { saveDetails } = useCRUD();

    useEffect(() => {
        if (current) {
            current.Dharug && setDharug(current.Dharug);
            current['Dharug(Gloss)'] && setDharugGloss(current['Dharug(Gloss)']);
            current.English && setEnglish(current.English);
            current['Gloss (english)'] && setEnglishGloss(current['Gloss (english)']);
        } else {
            setDharug(undefined);
            setDharugGloss(undefined);
            setEnglish(undefined);
            setEnglishGloss(undefined);
        }
    }, [current]);

    const updateDetails = async () => {
        if (current) {
            await saveDetails(current.id, 
                {dharug:dharug, gDharug: dharugGloss, english: english, gEnglish: englishGloss });
        } else {
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
