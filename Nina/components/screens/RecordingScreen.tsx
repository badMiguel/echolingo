import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Alert } from 'react-native';
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

    // recording and playback
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [recordingUris, setRecordingUris] = useState<string[]>([]);

    // load recordings from AsyncStorage for this sentence when the component loads
    useEffect(() => {
        loadRecordings();
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

    // play record
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

    // delete record
    const deleteRecording = async (uri: string) => {
        const updatedRecordingUris = recordingUris.filter(item => item !== uri);
        setRecordingUris(updatedRecordingUris);
        await AsyncStorage.setItem(`recordings_${sentence.id}`, JSON.stringify(updatedRecordingUris));
        Alert.alert('Recording deleted');
    };

    return (
        <View style={styles.container}>
            <Text>{sentence.English}</Text>
            <Text>{sentence["Dharug(Gloss)"]}</Text>
            <Text>{sentence["Gloss (english)"]}</Text>

            {/* recording controls */}
            <Button title="Start Recording" onPress={startRecording} disabled={!!recording} />
            <Button title="Stop Recording" onPress={stopRecording} disabled={!recording} />

            {/* scrollable list */}
            <FlatList
                data={recordingUris}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.recordingContainer}>
                        <Text>{`Recording ${index + 1}`}</Text>
                        <Button title="Play" onPress={() => playRecording(item)} />
                        <Button title="Delete" onPress={() => deleteRecording(item)} />
                    </View>
                )}
            />
        </View>
    );
}

