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
        accent: useThemeColor({}, 'accent'),
        tint: useThemeColor({}, 'tint'),
    }
}

const RecordingList = () => {
    const [dataRecorded, setDataRecorded] = useState<DataType[]>([]);
    const [dataNotRecorded, setDataNotRecorded] = useState<DataType[]>([]);
    const data = useTiwiListContext();
    const color = useColor();

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
            data: dataNotRecorded.length > 0 ? dataNotRecorded : [emptyTiwiData()]
        }, {
            title: "With recordings",
            data: dataRecorded.length > 0 ? dataRecorded : [emptyTiwiData()]
        }];

    return (
        <View style={{ backgroundColor: color.bgColor }}>
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) =>
                    item.id === 0 ? (
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
    const color = useColor();
    const goToSentence = () => {
        router.push({
            pathname: '/(addRecording)',
            params: {
                sentenceID: tiwi.id,
            },
        });
    }

    return (
        <View style={[styles.sentenceCard__container, { backgroundColor: color.accent }]}>
            <ThemedText type='defaultSemiBold'>{tiwi.Tiwi ? 'Tiwi: ' : 'Tiwi Gloss: '}</ThemedText>
            <ThemedText>{tiwi.Tiwi || tiwi['Gloss (tiwi)']}</ThemedText>
            <ThemedText type='defaultSemiBold'>{tiwi.English ? 'English: ' : 'English Gloss: '}</ThemedText>
            <ThemedText>{tiwi.English || tiwi['Gloss (english)']}</ThemedText>
            <View style={[styles.button__container, { backgroundColor: color.tint }]}>
                <Pressable onPress={() => goToSentence()}>
                    <ThemedText type='defaultSemiBold' style={{ color: color.bgColor }}>Add Recording</ThemedText>
                </Pressable>
            </View>
        </View>
    );
}

export default RecordingList

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
    },

    button__container: {
        marginTop: 5,
        paddingTop: 1,
        paddingBottom: 1,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 10,
        alignSelf: 'center',
    },
})
