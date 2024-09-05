import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Alert, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp } from '@react-navigation/native';
import { StackParamList } from './types';
import styles from '../styles/RecordingScreen_style';

// route prop type for RecordingScreen
type RecordingScreenRouteProp = RouteProp<StackParamList, 'RecordingScreen'>;

export default function RecordingScreen() {
    const route = useRoute<RecordingScreenRouteProp>();  
    const { sentence } = route.params;

    // recording and playback states
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [recordingUris, setRecordingUris] = useState<string[]>([]);
    const [selectedRecording, setSelectedRecording] = useState<string | null>(null);
    const [publishedRecording, setPublishedRecording] = useState<string | null>(null);
    const [isPublishable, setIsPublishable] = useState(false);

    // Load recordings and the previously published recording from AsyncStorage
    useEffect(() => {
        loadRecordings();
        loadPublishedRecording();
    }, []);

    const loadRecordings = async () => {
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
                setPublishedRecording(savedPublishedRecording);
                setSelectedRecording(savedPublishedRecording);  // Set the previously published recording as selected
            }
        } catch (error) {
            console.error('Failed to load published recording', error);
        }
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

    // play recording
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

    // delete recording
    const deleteRecording = async (uri: string) => {
        const updatedRecordingUris = recordingUris.filter(item => item !== uri);
        setRecordingUris(updatedRecordingUris);
        setSelectedRecording(null);  // Deselect if deleted
        setIsPublishable(false);     // Disable publish button if deleted
        await AsyncStorage.setItem(`recordings_${sentence.id}`, JSON.stringify(updatedRecordingUris));
        Alert.alert('Recording deleted');
    };

    // Publish recording (Save for student use)
    const publishRecording = async () => {
        if (selectedRecording) {
            await AsyncStorage.setItem(`publishedRecording_${sentence.id}`, selectedRecording);
            setPublishedRecording(selectedRecording);  // Set the newly selected recording as published
            Alert.alert('Recording published for students!');
        }
    };

    // Select a recording
    const selectRecording = (uri: string) => {
        setSelectedRecording(uri);
        setIsPublishable(true);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.txt}>English: {sentence.English}</Text>
            <Text style={styles.txt}>Dharug (Gloss): {sentence["Dharug(Gloss)"]}</Text>
            <Text style={styles.txt}>Gloss (english): {sentence["Gloss (english)"]}</Text>

            {/* Recording controls */}
            <Button title="Start Recording" onPress={startRecording} disabled={!!recording} />
            <Button title="Stop Recording" onPress={stopRecording} disabled={!recording} />

            {/* Scrollable list of recordings */}
            <FlatList
                data={recordingUris}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.recordingContainer}>
                        <Text>Recording</Text>
                        
                        {/* Checkbox to select a recording */}
                        <TouchableOpacity onPress={() => selectRecording(item)}>
                            <View style={[styles.checkBox, selectedRecording === item ? styles.checked : null]} />
                        </TouchableOpacity>
                        
                        {/* "Chosen" label if this is the published recording */}
                        {publishedRecording === item && (
                            <Text style={styles.chosenLabel}>Chosen</Text>
                        )}

                        <Button title="Play" onPress={() => playRecording(item)} />
                        <Button title="Delete" onPress={() => deleteRecording(item)} />
                    </View>
                )}
            />

            {/* Publish Button */}
            <Button 
                title="Publish" 
                onPress={publishRecording} 
                disabled={!selectedRecording}  // Disable if no recording selected
                color={selectedRecording ? 'blue' : 'grey'}  // Change color based on selection
            />
        </View>
    );
}
