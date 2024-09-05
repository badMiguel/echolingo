import React from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';  
import { StackNavigationProp } from '@react-navigation/stack';  
import { StackParamList, Sentence } from './types';  
import styles from '../styles/TeacherView_style';  

type TeacherViewNavigationProp = StackNavigationProp<any, 'TeacherView'>;

export default function TeacherView() {
    const navigation = useNavigation<TeacherViewNavigationProp>();  

    // sentences passed from TopicScreen
    const route = useRoute();
    const sentences = (route.params as { sentences: Sentence[] } | undefined)?.sentences || [];

    return (
        <View style={styles.container}>
            <FlatList
                data={sentences}  // use sentences passed from the TopicScreen
                renderItem={({ item }) => (
                    <View style={styles.sentenceContainer}>
                        <Text>English: {item.English}</Text>
                        <Text>Dharug (Gloss): {item["Dharug(Gloss)"]}</Text>
                        <Text>Gloss (english): {item["Gloss (english)"]}</Text>

                        {/* go to the RecordingScreen */}
                        <Button
                            title="View Recordings"
                            onPress={() => navigation.navigate('RecordingScreen', { sentence: item })}
                        />
                    </View>
                )}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
}


