import React from 'react';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { StackParamList } from './types';
import { RouteProp } from '@react-navigation/native';
import TeacherView from './teacher/TeacherView';
import StudentView from './student/StudentView';
import styles from '../styles/RecordingScreen_style';

type RecordingScreenRouteProp = RouteProp<StackParamList, 'RecordingScreen'>;

export default function RecordingScreen() {
    const route = useRoute<RecordingScreenRouteProp>();  
    const { sentence, userType } = route.params;


    const renderView = () => {
        console.log('userType:', userType);
        if (userType === 'teacher') {
            console.log('teacher');
            return <TeacherView sentence={sentence} />;
        } else if (userType === 'student') {
            console.log('student');
            return <StudentView sentence={sentence} />;
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.txt}>English: {sentence.English}</Text>
            <Text style={styles.txt}>Dharug (Gloss): {sentence["Dharug(Gloss)"]}</Text>
            <Text style={styles.txt}>Gloss (english): {sentence["Gloss (english)"]}</Text>
            {renderView()}
        </View>
    );
}
