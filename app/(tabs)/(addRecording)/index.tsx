import React, { useEffect, useState } from 'react'
import { Pressable, StyleSheet, TextInput, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'

import { DataType, useTiwiListContext } from '@/contexts/TiwiContext';
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
    const data = useTiwiListContext();
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
    const [tiwi, setTiwi] = useState<string | undefined>();
    const [tiwiGloss, setTiwiGloss] = useState<string | undefined>();
    const [english, setEnglish] = useState<string | undefined>();
    const [englishGloss, setEnglishGloss] = useState<string | undefined>();
    const [topic, setTopic] = useState<string | undefined>();

    const [tiwiError, setTiwiError] = useState<boolean>(false);
    const [englishError, setEnglishError] = useState<boolean>(false);

    const { saveDetails, addDetails } = useCRUD();
    const color = useColor();

    useEffect(() => {
        if (current) {
            current.Tiwi && setTiwi(current.Tiwi);
            current['Gloss (tiwi)'] && setTiwiGloss(current['Gloss (tiwi)']);
            current.English && setEnglish(current.English);
            current['Gloss (english)'] && setEnglishGloss(current['Gloss (english)']);
            current.Topic && setEnglishGloss(current.Topic);
        } else {
            clearForm();
        }
    }, [current]);

    const clearForm = () => {
        setTiwi(undefined);
        setTiwiGloss(undefined);
        setEnglish(undefined);
        setEnglishGloss(undefined);
        setTopic(undefined);
        setEnglishError(false);
        setTiwiError(false);
    }

    // todo add validation and error handling
    const updateDetails = async () => {
        let error: boolean = false;
        if (!(tiwi || tiwiGloss)) {
            setTiwiError(true)
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
                    { tiwi: tiwi, gTiwi: tiwiGloss, english: english, gEnglish: englishGloss, topic: topic })
                if (!status) {
                    throw new Error('Failed to create new data');
                }

                // todo error handling
                currentID && changeCurrent(currentID);
                router.setParams({ sentenceID: currentID });
            } else {
                await saveDetails(current.id, { tiwi: tiwi, gTiwi: tiwiGloss, english: english, gEnglish: englishGloss, topic: topic });
            }
        } catch (err) {
            console.error('Failed to create new data', err);
        }
    }

    return (
        <View>
            <View style={styles.formItem__container}>
                <ThemedText type='defaultSemiBold'>Tiwi</ThemedText>
                <TextInput
                    autoCorrect={false}  // might be frustrating if yes for uncommon language
                    value={tiwi}
                    onChangeText={(text) => {
                        setTiwi(text)
                        setTiwiError(false);
                    }}
                    style={[styles.formItem, { borderColor: tiwiError ? 'red' : 'black' }]}
                    placeholder={tiwiError
                        ? 'Should add at least either Tiwi or Tiwi gloss'
                        : 'Enter tiwi'
                    }
                    placeholderTextColor={tiwiError ? '#ff474c' : color.tint}
                    cursorColor={color.textColor}
                />
            </View>

            <View style={styles.formItem__container}>
                <ThemedText type='defaultSemiBold'>Tiwi (Gloss)</ThemedText>
                <TextInput
                    autoCorrect={false}  // might be frustrating if yes for uncommon language
                    value={tiwiGloss}
                    onChangeText={(text) => {
                        setTiwiGloss(text)
                        setTiwiError(false);
                    }}
                    style={styles.formItem}
                    placeholder={tiwiError
                        ? 'Should add at least either Tiwi or Tiwi gloss'
                        : 'Enter tiwi gloss'
                    }
                    placeholderTextColor={tiwiError ? '#ff474c' : color.tint}
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
                    style={[styles.formItem, { borderColor: tiwiError ? 'red' : 'black' }]}
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
