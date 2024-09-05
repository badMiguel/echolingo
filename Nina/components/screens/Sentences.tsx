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
                        <Text style={styles.txt}>English: {item.English}</Text>
                        <Text style={styles.txt}>Dharug (Gloss): {item["Dharug(Gloss)"]}</Text>
                        <Text style={styles.txt}>Gloss (english): {item["Gloss (english)"]}</Text>

                        {/* go to the RecordingScreen */}
                        <Button
                            title="View Recordings"
                            onPress={() => navigation.navigate('Recording Screen', { sentence: item })}
                        />
                    </View>
                )}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
}


