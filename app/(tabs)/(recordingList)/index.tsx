import { Button, FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { DharugDataType, useSetDharugContextID } from '@/contexts/DharugContext'
import { router } from 'expo-router'
import data from '@/data/json/dharug_list.json'

const RecordingList = () => {

    return (
        <FlatList
            data={data}
            renderItem={({ item }) =>
                <SentenceCard dharug={item} finished={false} />
            }
            keyExtractor={item => item.id.toString()}
        />
    )
}

const SentenceCard: React.FC<{ dharug: DharugDataType, finished: boolean }> = ({ dharug, finished }) => {
    const setCurrentID = useSetDharugContextID();

    const goToSentence = () => {
        setCurrentID(dharug.id);

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
                title='Make Recording'
                onPress={() => goToSentence()}
            />
        </View>
    );
}

export default RecordingList

const styles = StyleSheet.create({})
