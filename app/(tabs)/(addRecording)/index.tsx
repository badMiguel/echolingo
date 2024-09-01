import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'

import { DataType, useDharugListContext } from '@/contexts/DharugContext';

export default function Add() {
    const data = useDharugListContext();

    let currentID: number = 0;
    let current: DataType | undefined

    const { sentenceID } = useLocalSearchParams();
    if (data) {
        currentID = Array.isArray(sentenceID) ? parseInt(sentenceID[0]) : parseInt(sentenceID);
        current = data.find(item => item.id === currentID);
    }

    return (
        <View>
            <AddDetails current={current} />
            <AddRecording currentID={currentID} />
            <Button title={currentID ? 'Update' : 'Add'} onPress={() => { }} />
            {currentID
                ? <Button title='Back' onPress={() => router.navigate('/(recordingList)')} />
                : null
            }
        </View>
    )
}

const AddDetails: React.FC<{ current: DataType | undefined }> = ({ current }) => {
    const [dharug, setDharug] = useState('');
    const [dharugGloss, setDharugGloss] = useState('');
    const [english, setEnglish] = useState('');
    const [englishGloss, setEnglishGloss] = useState('');

    useEffect(() => {
        if (current) {
            current.Dharug && setDharug(current.Dharug);
            current['Dharug(Gloss)'] && setDharugGloss(current['Dharug(Gloss)']);
            current.English && setEnglish(current.English);
            current['Gloss (english)'] && setEnglishGloss(current['Gloss (english)']);
        } else {
            setDharug('');
            setDharugGloss('');
            setEnglish('');
            setEnglishGloss('');
        }
    }, [current])

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
