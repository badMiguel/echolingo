import { router, useNavigation } from 'expo-router';
import React, { useEffect } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { useCourseContext } from '@/contexts/CourseContext';
import { DataType, useDharugListContext, useSetDharugContext } from '@/contexts/DharugContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/components/ThemedText';

const useColor = () => {
    return {
        bgColor: useThemeColor({}, 'background'),
        textColor: useThemeColor({}, 'text'),
        tint: useThemeColor({}, 'tint'),
        accent: useThemeColor({}, 'accent'),
    };
};

export default function Course() {
    const navigation = useNavigation();
    const { course } = useCourseContext();
    const dharugList = useDharugListContext();
    const color = useColor();

    // change header title dynamically
    useEffect(() => {
        if (course !== 'unknown') {
            navigation.setOptions({
                title: course
            })
        }
    }, [navigation])

    return (
        <View style={[{ backgroundColor: color.bgColor }]}>
            {dharugList ? (
                <>
                    <FlatList
                        style={styles.flatlist}
                        data={dharugList}
                        renderItem={({ item }) =>
                            <SentenceCard dharug={item} />
                        }
                        keyExtractor={item => item.id.toString()}
                    />
                </>
            ) : (
                <Text>No sentences made yet for this course</Text>
            )}

        </View>
    );
}

const SentenceCard: React.FC<{ dharug: DataType }> = ({ dharug }) => {
    const setCurrentID = useSetDharugContext();
    const color = useColor();

    const goToSentence = () => {
        setCurrentID(dharug);

        router.push({
            pathname: '/sentence'
        });
    }

    return (
        <View style={[styles.sentenceCard__container, { backgroundColor: color.accent }]}>
            <ThemedText type='defaultSemiBold'>{dharug.Dharug ? 'Dharug: ' : 'Dharug Gloss: '}</ThemedText>
            <ThemedText>{dharug.Dharug || dharug['Dharug(Gloss)']}</ThemedText>
            <ThemedText type='defaultSemiBold'>{dharug.English ? 'English: ' : 'English Gloss: '}</ThemedText>
            <ThemedText>{dharug.English || dharug['Gloss (english)']}</ThemedText>
            <View style={[styles.button__container, { backgroundColor: color.tint }]}>
                <Pressable onPress={() => goToSentence()}>
                    <ThemedText type='defaultSemiBold' style={{ color: color.bgColor }}>Study</ThemedText>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    flatlist: {
        paddingLeft: 30,
        paddingRight: 30,
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
