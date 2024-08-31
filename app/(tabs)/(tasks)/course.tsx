import { router, useNavigation } from 'expo-router';
import React, { useEffect } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native'
import { useCourseContext } from '@/contexts/CourseContext';
import { DataType, useDharugListContext, useSetDharugContext } from '@/contexts/DharugContext';

export default function Course() {
    const navigation = useNavigation();
    const { course } = useCourseContext();
    const dharugList = useDharugListContext();

    // change header title dynamically
    useEffect(() => {
        if (course !== 'unknown') {
            navigation.setOptions({
                title: course
            })
        }
    }, [navigation])
    return (
        <>
            {dharugList ? (
                <>
                    <FlatList
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

        </>
    );
}

const SentenceCard: React.FC<{ dharug: DataType }> = ({ dharug }) => {
    const setCurrentID = useSetDharugContext();

    const goToSentence = () => {
        setCurrentID(dharug);

        router.push({
            pathname: '/sentence'
        });
    }

    return (
        <View>
            <Text> {dharug.id}</Text>
            <Text>{dharug.Dharug || dharug['Dharug(Gloss)']}</Text>
            <Text>{dharug.English || dharug['Gloss (english)']}</Text>
            <Button
                title='Study'
                onPress={() => goToSentence()}
            />
        </View>
    );
}

const styles = StyleSheet.create({})
