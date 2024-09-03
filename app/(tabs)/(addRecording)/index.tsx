import React, { useContext, useEffect, useState } from 'react'
import { Button, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { ExpoRoot, router, useLocalSearchParams, useNavigation } from 'expo-router'

import { DataType, useDharugListContext } from '@/contexts/DharugContext';
import useCRUD from '@/hooks/recording/useCRUD';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

type AddDetailProp = {
    current: DataType | undefined;
    changeCurrent: (currentID: number) => void;
};

const useColor = () => {
    return {
        bgColor: useThemeColor({}, 'background'),
        textColor: useThemeColor({}, 'text'),
        tint: useThemeColor({}, 'tint'),
        accent: useThemeColor({}, 'accent'),
    }
}

export default function Add() {
    const [currentID, setCurrentID] = useState<number>();
    const [current, setCurrent] = useState<DataType | undefined>();

    const { sentenceID } = useLocalSearchParams();
    const data = useDharugListContext();
    const color = useColor();

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
        <View style={[styles.mainView, { backgroundColor: color.bgColor }]}>
            <AddDetails current={current} changeCurrent={updateCurrent} />
            {currentID ? (
                <>
                    <AddRecording currentID={currentID} />
                    {sentenceID && (
                        <Pressable
                            style={[styles.button, { backgroundColor: color.tint }]}
                            onPress={() => router.navigate('/(recordingList)')}
                        >
                            <ThemedText
                                type='defaultSemiBold'
                                style={{ color: color.bgColor }}
                            >Back</ThemedText>
                        </Pressable>
                    )}
                </>
            ) : null
            }
        </View >
    )
}

const AddDetails: React.FC<AddDetailProp> = ({ current, changeCurrent }) => {
    const [dharug, setDharug] = useState<string | undefined>();
    const [dharugGloss, setDharugGloss] = useState<string | undefined>();
    const [english, setEnglish] = useState<string | undefined>();
    const [englishGloss, setEnglishGloss] = useState<string | undefined>();
    const [topic, setTopic] = useState<string | undefined>();

    const [dharugError, setDharugError] = useState<boolean>(false);
    const [englishError, setEnglishError] = useState<boolean>(false);

    const { saveDetails, addDetails } = useCRUD();
    const color = useColor();

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

    const clearForm = () => {
        setDharug(undefined);
        setDharugGloss(undefined);
        setEnglish(undefined);
        setEnglishGloss(undefined);
        setTopic(undefined);
        setEnglishError(false);
        setDharugError(false);
    }

    // todo add validation and error handling
    const updateDetails = async () => {
        let error: boolean = false;
        if (!(dharug || dharugGloss)) {
            setDharugError(true)
            error = true;
        }

        if (!(english || englishGloss)) {
            setEnglishError(true)
            error = true;
        }

        if (error) { return }

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
        <View>
            <View style={styles.formItem__container}>
                <ThemedText type='defaultSemiBold'>Dharug</ThemedText>
                <TextInput
                    autoCorrect={false}  // might be frustrating if yes for uncommon language
                    value={dharug}
                    onChangeText={(text) => {
                        setDharug(text)
                        setDharugError(false);
                    }}
                    style={[styles.formItem, { borderColor: dharugError ? 'red' : 'black' }]}
                    placeholder={dharugError
                        ? 'Should add at least either Dharug or Dharug gloss'
                        : 'Enter dharug'
                    }
                    placeholderTextColor={dharugError ? '#ff474c' : color.tint}
                    cursorColor={color.textColor}
                />
            </View>

            <View style={styles.formItem__container}>
                <ThemedText type='defaultSemiBold'>Dharug (Gloss)</ThemedText>
                <TextInput
                    autoCorrect={false}  // might be frustrating if yes for uncommon language
                    value={dharugGloss}
                    onChangeText={(text) => {
                        setDharugGloss(text)
                        setDharugError(false);
                    }}
                    style={styles.formItem}
                    placeholder={dharugError
                        ? 'Should add at least either Dharug or Dharug gloss'
                        : 'Enter dharug gloss'
                    }
                    placeholderTextColor={dharugError ? '#ff474c' : color.tint}
                    cursorColor={color.textColor}
                />
            </View>

            <View style={styles.formItem__container}>
                <ThemedText type='defaultSemiBold'>English</ThemedText>
                <TextInput
                    autoCorrect={false}  // might be frustrating if yes for uncommon language
                    value={english}
                    onChangeText={(text) => {
                        setEnglish(text)
                        setEnglishError(false);
                    }}
                    style={[styles.formItem, { borderColor: dharugError ? 'red' : 'black' }]}
                    placeholder={englishError
                        ? 'Should add at least either English or English gloss'
                        : 'Enter English'
                    }
                    placeholderTextColor={englishError ? '#ff474c' : color.tint}
                    cursorColor={color.textColor}
                />
            </View>

            <View style={styles.formItem__container}>
                <ThemedText type='defaultSemiBold'>English Gloss</ThemedText>
                <TextInput
                    autoCorrect={false}  // might be frustrating if yes for uncommon language
                    value={englishGloss}
                    onChangeText={(text) => {
                        setEnglishGloss(text)
                        setEnglishError(false);
                    }}
                    style={[styles.formItem, { borderColor: englishError ? 'red' : 'black' }]}
                    placeholder={englishError
                        ? 'Should add at least either English or English gloss'
                        : 'Enter English gloss'
                    }
                    placeholderTextColor={englishError ? '#ff474c' : color.tint}
                    cursorColor={color.textColor}
                />
            </View>

            <View style={styles.formItem__container}>
                <ThemedText type='defaultSemiBold'>Topic</ThemedText>
                <TextInput
                    autoCorrect={false}  // might be frustrating if yes for uncommon language
                    value={topic}
                    onChangeText={(text) => setTopic(text)}
                    style={styles.formItem}
                    placeholder='Topic (optional)'
                    placeholderTextColor={color.tint}
                    cursorColor={color.textColor}
                />
            </View>

            <Pressable style={[styles.button, { backgroundColor: color.tint }]} onPress={() => updateDetails()}>
                <ThemedText
                    type='defaultSemiBold'
                    style={{ color: color.bgColor }}
                >
                    {current?.id ? 'Update' : 'Add'}
                </ThemedText>
            </Pressable>
            <Pressable style={[styles.button, { backgroundColor: color.tint }]} onPress={() => clearForm()}>
                <ThemedText
                    type='defaultSemiBold'
                    style={{ color: color.bgColor }}
                >Clear</ThemedText>
            </Pressable>
        </View>
    );
}

function AddRecording({ currentID }: { currentID: number | undefined }) {
    const color = useColor();
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
            <Pressable style={[styles.button, { backgroundColor: color.tint }]} onPress={() => record()}>
                <ThemedText
                    type='defaultSemiBold'
                    style={{ color: color.bgColor }}
                >Record Now</ThemedText>
            </Pressable>
            <Pressable style={[styles.button, { backgroundColor: color.tint }]} onPress={() => upload()}>
                <ThemedText
                    type='defaultSemiBold'
                    style={{ color: color.bgColor }}
                >Upload From Device</ThemedText>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    mainView: {
        paddingTop: 30,
        paddingRight: 30,
        paddingLeft: 30,
        flex: 1,
    },

    formItem: {
        borderBottomWidth: 0.2,
    },

    formItem__container: {
        marginBottom: 30,
    },

    button: {
        marginBottom: 10,
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
})
