import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'

import { DharugDataType } from '@/contexts/DharugContext';
import data from '@/data/json/dharug_list.json'

export default function AddRecording() {
    const { sentenceID } = useLocalSearchParams();
    const currentID = Array.isArray(sentenceID) ? parseInt(sentenceID[0]) : parseInt(sentenceID);
    const current: DharugDataType | undefined = data.find(item => item.id === currentID);

    // <View>
    //     {current.Dharug &&
    //         <>
    //             <Text>Dharug:</Text>
    //             <Text>{current.Dharug}</Text>
    //         </>
    //     }
    //
    //     {current['Dharug(Gloss)'] &&
    //         <>
    //             <Text>Dharug (Gloss):</Text>
    //             <Text>{current['Dharug(Gloss)']}</Text>
    //         </>
    //     }
    //
    //     {current.recording
    //         ? <Recording link={current.recording} />
    //         : <Text>No recording available yet</Text>
    //     }
    //
    //     {current.English &&
    //         <>
    //             <Text>English:</Text>
    //             <Text>{current.English}</Text>
    //         </>
    //     }
    //
    //     {current['Gloss (english)'] &&
    //         <>
    //             <Text>English (Gloss):</Text>
    //             <Text>{current['Gloss (english)']}</Text>
    //         </>
    //     }
    // </View>

    return (
        <View>
            <AddDetails current={current} />
            {currentID
                ? <Button title='Back' onPress={() => router.navigate('/(recordingList)')} />
                : null
            }
        </View>
    )
}

const AddDetails: React.FC<{ current: DharugDataType | undefined }> = ({ current }) => {
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

const styles = StyleSheet.create({})
