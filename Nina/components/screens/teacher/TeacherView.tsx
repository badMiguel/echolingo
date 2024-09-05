import React, { useState, useEffect } from 'react';
import { View, Button, FlatList, Alert, TouchableOpacity, Text } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { Sentence, StackParamList } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/TeacherView_style';

// interface TeacherViewProps {
//     sentence: Sentence;  
// }

export default function TeacherView({ sentence }: { sentence: Sentence }) {
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [recordingUris, setRecordingUris] = useState<string[]>([]);
    const [selectedRecording, setSelectedRecording] = useState<string | null>(null);
    const [publishedRecording, setPublishedRecording] = useState<string | null>(null);
    const [isPublishable, setIsPublishable] = useState(false);

    useEffect(() => {
        console.log('teacher');
        loadRecordings();
        loadPublishedRecording();
    }, [sentence.id]);

    const loadRecordings = async () => {
        console.log('Loading recordings for sentence:', sentence.id);
        try {
            const savedRecordings = await AsyncStorage.getItem(`recordings_${sentence.id}`);
            if (savedRecordings) {
                setRecordingUris(JSON.parse(savedRecordings));
            }
        } catch (error) {
            console.error('Failed to load recordings', error);
        }    
    };

    const loadPublishedRecording = async () => {
        try {
            const savedPublishedRecording = await AsyncStorage.getItem(`publishedRecording_${sentence.id}`);
            if (savedPublishedRecording) {
                const parsedRecording = JSON.parse(savedPublishedRecording);
                setPublishedRecording(parsedRecording);
                setSelectedRecording(parsedRecording);  // Set the previously published recording as selected
            }
        } catch (error) {
            console.error('Failed to load published recording', error);
        }    
    };

    const publishRecording = async () => {
        if (selectedRecording) {
            console.log('Storing recording:', selectedRecording);
            await AsyncStorage.setItem(`publishedRecording_${sentence.id}`, JSON.stringify(selectedRecording));
            setPublishedRecording(selectedRecording);  // Set the newly selected recording as published
            Alert.alert('Recording published for students!');
        }
    };

    // Select a recording
    const selectRecording = (uri: string) => {
        setSelectedRecording(uri);
        setIsPublishable(true);
    };

    const playRecording = async (uri: string) => {
        try {
            if (sound) {
                await sound.unloadAsync();
            }
            const { sound: newSound } = await Audio.Sound.createAsync({ uri });
            setSound(newSound);
            await newSound.playAsync();
        } catch (error) {
            console.error('Error playing sound', error);
        }
    };

    const deleteRecording = async (uri: string) => {
        const updatedRecordingUris = recordingUris.filter(item => item !== uri);
        setRecordingUris(updatedRecordingUris);
        setSelectedRecording(null);  // Deselect if deleted
        setIsPublishable(false);     // Disable publish button if deleted
        await AsyncStorage.setItem(`recordings_${sentence.id}`, JSON.stringify(updatedRecordingUris));
        Alert.alert('Recording deleted');
    };

        // start recording
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

    // stop recording + save
    const stopRecording = async () => {
        try {
            if (recording) {
                await recording.stopAndUnloadAsync();
                const uri = recording.getURI();
                setRecording(null);

                // Save the recording URI
                const newRecordingUris = [...recordingUris, uri!];
                setRecordingUris(newRecordingUris);
                await AsyncStorage.setItem(`recordings_${sentence.id}`, JSON.stringify(newRecordingUris));

                Alert.alert('Recording saved!');
            }
        } catch (err) {
            console.error('Failed to stop recording', err);
        }
    };

    return (
        <View style={styles.teacher_container}>
            {/* Recording controls */}
            <Button title="Start Recording" onPress={startRecording} disabled={!!recording} />
            <Button title="Stop Recording" onPress={stopRecording} disabled={!recording} />

            <FlatList
                data={recordingUris}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.recordingContainer}>
                        <Text>Recording</Text>
                        <TouchableOpacity onPress={() => selectRecording(item)}>
                            <View style={[styles.checkBox, selectedRecording === item ? styles.checked : null]} />
                        </TouchableOpacity>
                        {publishedRecording === item && (
                            <Text style={styles.chosenLabel}>Chose</Text>
                        )}
                        <Button title="Play" onPress={() => playRecording(item)} />
                        <Button title="Delete" onPress={() => deleteRecording(item)} />
                    </View>
                )}
            />
            <Button 
                title="Publish" 
                onPress={publishRecording} 
                disabled={!selectedRecording} 
                color={selectedRecording ? 'blue' : 'grey'} 
            />
            <Button 
                title="View Students' Submissions" 
                onPress={() => {}} 
            />
        </View>
    );
}
