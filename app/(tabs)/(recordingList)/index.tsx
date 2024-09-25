import { Pressable, SectionList, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DataType, emptyTiwiData, useTiwiListContext } from '@/contexts/TiwiContext'
import { router } from 'expo-router'
import { ThemedText } from '@/components/ThemedText'
import { useThemeColor } from '@/hooks/useThemeColor'

const useColor = () => {
    return {
        bgColor: useThemeColor({}, 'background'),
        textColor: useThemeColor({}, 'text'),
        primary: useThemeColor({}, 'primary'),
        primary_tint: useThemeColor({}, 'primary_tint'),
    }
}

function filterRecorded(data: DataType): { recorded: DataType[], notRecorded: DataType[] } {
    let recorded: DataType[] = [];
    let notRecorded: DataType[] = [];
    const recordedKey = new Set(Object.keys(data).filter(key => data[key]["recording"]));

    for (const key in data) {
        if (recordedKey.has(key)) {
            recorded.push({ [key]: data[key] });
        } else {
            notRecorded.push({ [key]: data[key] });
        }
    }

    return { recorded, notRecorded };
}

export default function RecordingList() {
    const [dataRecorded, setDataRecorded] = useState<DataType[]>([]);
    const [dataNotRecorded, setDataNotRecorded] = useState<DataType[]>([]);
    const data = useTiwiListContext();
    const color = useColor();

    useEffect(() => {
        // todo error handling and optimisation
        if (data) {
            const { recorded, notRecorded } = filterRecorded(data);

            setDataRecorded(recorded);
            setDataNotRecorded(notRecorded);
        }
    }, []);

    useEffect(() => {
        // todo error handling and optimisation
        if (data) {
            const { recorded, notRecorded } = filterRecorded(data);

            setDataRecorded(recorded);
            setDataNotRecorded(notRecorded);
        }
    }, [data]);

    const sections = [
        {
            title: "Not yet recorded",
            data: dataNotRecorded.length > 0 ? dataNotRecorded : [{ "0": emptyTiwiData() }]
        }, {
            title: "With recordings",
            data: dataRecorded.length > 0 ? dataRecorded : [{ "0": emptyTiwiData() }]
        }
    ];

    return (
        <View style={{ backgroundColor: color.bgColor }}>
            <SectionList
                sections={sections}
                keyExtractor={(item) => Object.keys(item)[0]}
                renderItem={({ item }) =>
                    Object.keys(item)[0] === "0" ? (
                        item.completed ? (
                            <ThemedText style={{}}>All sentences have been recorded</ThemedText>
                        ) : (
                            <ThemedText style={{ marginBottom: 30 }}>No sentences recorded yet</ThemedText>
                        )
                    ) : (
                        <SentenceCard tiwi={item} finished={false} />
                    )
                }
                renderSectionHeader={({ section: { title } }) => (
                    <ThemedText type='subtitle' style={styles.sectionlist__header}>{title}</ThemedText>
                )}
                style={styles.sectionlist}
            />
        </View>
    )
}

const SentenceCard: React.FC<{ tiwi: DataType, finished: boolean }> = ({ tiwi }) => {
    const id: string = Object.keys(tiwi)[0]
    const color = useColor();
    const goToSentence = () => {
        router.push({
            pathname: tiwi.recording ? '/viewRecording' : '/(addRecording)',
            params: {
                sentenceID: id
            },
        });
    }

    return (
        <View style={[styles.sentenceCard__container, { backgroundColor: color.primary_tint }]}>
            <ThemedText type='defaultSemiBold'>{tiwi.Tiwi ? 'Tiwi: ' : 'Tiwi Gloss: '}</ThemedText>
            <ThemedText>{tiwi[id].Tiwi}</ThemedText>
            <ThemedText type='defaultSemiBold'>{tiwi.English ? 'English: ' : 'English Gloss: '}</ThemedText>
            <ThemedText>{tiwi[id].English}</ThemedText>
            <View style={[styles.button__container, { backgroundColor: color.primary }]}>
                <Pressable onPress={() => goToSentence()}>
                    <ThemedText type='defaultSemiBold' style={{ color: color.bgColor }}>{tiwi.recording ? "View" : "Add Recording"}</ThemedText>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    sectionlist: {
        paddingLeft: 30,
        paddingRight: 30,
    },

    sectionlist__header: {
        marginTop: 30,
    },

    sentenceCard__container: {
        marginBottom: 10,
        marginTop: 10,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 10,
        gap: 10,
    },

    button__container: {
        marginTop: 5,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 30,
        paddingRight: 30,
        borderRadius: 10,
        alignSelf: 'center',
    },
})
