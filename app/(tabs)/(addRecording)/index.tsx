import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'

import { DataType, useDharugListContext } from '@/contexts/DharugContext';
import useCRUD from '@/hooks/recording/useCRUD';
import { useIsFocused } from '@react-navigation/native';
import { ThemedText } from '@/components/ThemedText';

type AddDetailProp = {
    current: DataType | undefined;
    changeCurrent: (currentID: number) => void;
};

export default function Add() {
    const [currentID, setCurrentID] = useState<number>();
    const [current, setCurrent] = useState<DataType | undefined>();

    const { sentenceID } = useLocalSearchParams();
    const data = useDharugListContext();

    useEffect(() => {
        if (data) {  // todo error handling
            const id: number = Array.isArray(sentenceID) ? parseInt(sentenceID[0]) : parseInt(sentenceID);
            const item: DataType | undefined = data.find(item => item.id === id);

            setCurrentID(id)
            setCurrent(item)
        }
    }, [sentenceID, data]);


    const updateCurrent = (currentID: number) => { setCurrentID(currentID) }

    return (
        <View>
            <AddDetails current={current} changeCurrent={updateCurrent} />
            {currentID ? (
                <>
                    <AddRecording currentID={currentID} />
                    {sentenceID && <Button title='Back' onPress={() => router.navigate('/(recordingList)')} />}
                </>
            ) : null}
        </View>
    )
}

const AddDetails: React.FC<AddDetailProp> = ({ current, changeCurrent }) => {
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
            clearForm();
        }
    }, [current]);

    useEffect(() => {
        setShowError(false);
    }, [dharug, dharugGloss, english, englishGloss]);

    const clearForm = () => {
        setDharug(undefined);
        setDharugGloss(undefined);
        setEnglish(undefined);
        setEnglishGloss(undefined);
        setTopic(undefined);
    }

    // todo add validation and error handling
    const updateDetails = async () => {
        if (!((dharug || dharugGloss) && (english || englishGloss))) {
            setShowError(true);
            return;
        }

        try {
            if (!current) {
                const { status, currentID } = await addDetails(
                    { dharug: dharug, gDharug: dharugGloss, english: english, gEnglish: englishGloss, topic: topic })
                if (!status) {
                    throw new Error('Failed to create new data');
                }

                // todo error handling
                currentID && changeCurrent(currentID);
                router.setParams({ sentenceID: currentID });
            } else {
                await saveDetails(current.id, { dharug: dharug, gDharug: dharugGloss, english: english, gEnglish: englishGloss, topic: topic });
            }
        } catch (err) {
            console.error('Failed to create new data', err);
        }
    }

    return (
        <View style={styles.mainView}>
            <View style={styles.formItem}>
                <ThemedText type='defaultSemiBold'>Dharug</ThemedText>
                <TextInput
                    autoCorrect={false}  // might be frustrating if yes for uncommon language
                    value={dharug}
                    onChangeText={(text) => setDharug(text)}
                    style={[styles.formItem,
                    {}]}
                />
            </View>

            <View style={styles.formItem}>
                <ThemedText type='defaultSemiBold'>Dharug (Gloss)</ThemedText>
                <TextInput
                    autoCorrect={false}  // might be frustrating if yes for uncommon language
                    value={dharugGloss}
                    onChangeText={(text) => setDharugGloss(text)}
                    style={styles.formItem}
                />
            </View>

            <View style={styles.formItem}>
                <ThemedText type='defaultSemiBold'>English</ThemedText>
                <TextInput
                    autoCorrect={false}  // might be frustrating if yes for uncommon language
                    value={english}
                    onChangeText={(text) => setEnglish(text)}
                    style={styles.formItem}
                />
            </View>

            <View style={styles.formItem}>
                <ThemedText type='defaultSemiBold'>English Gloss</ThemedText>
                <TextInput
                    autoCorrect={false}  // might be frustrating if yes for uncommon language
                    value={englishGloss}
                    onChangeText={(text) => setEnglishGloss(text)}
                    style={styles.formItem}
                />
            </View>

            <View style={styles.formItem}>
                <ThemedText type='defaultSemiBold'>Topic</ThemedText>
                <TextInput
                    autoCorrect={false}  // might be frustrating if yes for uncommon language
                    value={topic}
                    onChangeText={(text) => setEnglishGloss(text)}
                    style={styles.formItem}
                />
            </View>

            <Button
                title={current?.id ? 'Update' : 'Add'}
                onPress={() => updateDetails()}
            />
            <Button title="Clear" onPress={() => clearForm()} />
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

const styles = StyleSheet.create({
    mainView: {
        marginRight: 30,
        marginLeft: 30,
        marginTop: 30,
    },

    formItem: {
        borderBottomWidth: 0.2,
    },
})
