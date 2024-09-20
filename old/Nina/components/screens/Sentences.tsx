import React from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';  
import { StackNavigationProp } from '@react-navigation/stack';  
import { StackParamList, Sentence } from './types';  
import styles from '../styles/Sentences_style';  

type SentencesNavigationProp = StackNavigationProp<StackParamList, 'Sentences'>;

export default function Sentences() {
    const navigation = useNavigation<SentencesNavigationProp>();
    const route = useRoute();
    const { sentences, userType } = route.params as { sentences: Sentence[], userType: 'teacher' | 'student' };

    return (
        <View style={styles.sentences_container}>
            <FlatList
                data={sentences}  // use sentences passed from the TopicScreen
                renderItem={({ item }) => (
                    <View style={styles.sentenceContainer}>
                        <Text style={styles.txt}>English: {item.English}</Text>
                        <Text style={styles.txt}>Dharug (Gloss): {item["Dharug(Gloss)"]}</Text>
                        <Text style={styles.txt}>Gloss (english): {item["Gloss (english)"]}</Text>

                        {/* go to the RecordingScreen */}
                        <Button
                            title="View Recordings"
                            onPress={() => navigation.navigate('RecordingScreen', { sentence: item, userType })}
                        />
                    </View>
                )}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
}


