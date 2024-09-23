import React from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import dharugList from '../../assets/data/dharugList.json';
import { Sentence, StackParamList } from './types';
import styles from '../styles/TopicScreen_style';

type TopicScreenRouteProp = RouteProp<StackParamList, 'TopicScreen'>;

// extract the role (userType) from the route params
export default function TopicScreen() {
    const navigation = useNavigation();
    const route = useRoute<TopicScreenRouteProp>();  
    const { userType } = route.params;  
    
    // extract topics, categorizing by topic
    const topics = dharugList.reduce((acc: { [key: string]: Sentence[] }, sentence: Sentence) => {
        const topic = sentence.Topic || 'Others';  // 'Others' if no topic
        if (!acc[topic]) acc[topic] = [];
        acc[topic].push(sentence);
        return acc;
    }, {} as { [key: string]: Sentence[] });

    const topicList = Object.keys(topics).map((topic) => ({
        topic,
        sentences: topics[topic],  // list of sentences for the topic
    }));

    return (
        <View style={styles.container}>
            {/* console.log('role:', userType); */}

            <FlatList
                data={topicList}
                renderItem={({ item }) => (
                    <View style={styles.topicContainer}>
                        <Text style={ styles.topic_title }>{item.topic}</Text>
                        
                        <Button
                            title= {userType === 'teacher'? 'View' : 'Learn'}
                            onPress={() => {
                                navigation.navigate('Sentences', { sentences: item.sentences, userType });
                            }}
                        />
                    </View>
                )}
                keyExtractor={(item) => item.topic}
            />
        </View>
    );
}
