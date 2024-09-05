// student/StudentView.tsx
import React, { useState, useEffect } from 'react';
import { View, Button, Alert } from 'react-native';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/StudentView_style';
import { Sentence } from '../types';

export default function StudentView({ sentence }: { sentence: Sentence }) {
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [recordingUri, setRecordingUri] = useState<string | null>(null);  // For student’s current recording
    const [teacherPublishedUri, setTeacherPublishedUri] = useState<string | null>(null);  // Teacher’s published recording

    // Load teacher's published recording when component mounts
    useEffect(() => {
        loadPublishedRecording();
    }, [sentence.id]);

    const loadPublishedRecording = async () => {
        try {
            const savedPublishedRecording = await AsyncStorage.getItem(`publishedRecording_${sentence.id}`);
            if (savedPublishedRecording) {
                setTeacherPublishedUri(JSON.parse(savedPublishedRecording));
            }
        } catch (error) {
            console.error('Failed to load teacher’s published recording', error);
        }
    };

    const startRecording = async () => {
        try {
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission not granted');
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    };

    const stopRecording = async () => {
        try {
            if (recording) {
                await recording.stopAndUnloadAsync();
                const uri = recording.getURI();
                setRecording(null);

                // save the recording URI
                setRecordingUri(uri);
                await AsyncStorage.setItem(`recordings_${sentence.id}`, uri);

                Alert.alert('Recording saved!');
            }
        } catch (err) {
            console.error('Failed to stop recording', err);
        }    
    };

    const playBackRecording = async () => {
        try {
            if (sound) {
                await sound.unloadAsync();
            }
            const { sound: newSound } = await Audio.Sound.createAsync({ uri: recordingUri! });
            setSound(newSound);
            await newSound.playAsync();
        } catch (error) {
            console.error('Error playing sound', error);
        }    
    };

    const playPublishedRecording = async () => {
        try {
            if (teacherPublishedUri) {
                const { sound: newSound } = await Audio.Sound.createAsync({ uri: teacherPublishedUri });
                setSound(newSound);
                await newSound.playAsync();
            } else {
                Alert.alert('No published recording available');
            }
        } catch (error) {
            console.error('Error playing teacher’s recording', error);
        }    
    };

    const submitRecording = async () => {
        if (recordingUri) {
            // Logic to submit the recording to the teacher
            await AsyncStorage.setItem(`studentSubmission_${sentence.id}`, JSON.stringify(recordingUri));
            Alert.alert('Recording submitted to the teacher!');
        } else {
            Alert.alert('No recording to submit!');
        }
    };

    return (
        <View style={styles.student_container}>
            <Button title="Play Teacher’s Recording" onPress={playPublishedRecording} />
            <Button title="Start Recording" onPress={startRecording} />
            <Button title="Stop Recording" onPress={stopRecording} />
            <Button title="Play Back Your Recording" onPress={playBackRecording} />
            <Button title="Submit Recording" onPress={submitRecording} />
        </View>
    );
}
