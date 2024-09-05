import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { Word } from '../screens/types';

interface WordCardProps {
  word: Word; // Define word prop type
}

const WordCard: React.FC<WordCardProps> = ({ word }) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === 'granted') {
        await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
        const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        setRecording(recording);
      } else {
        Alert.alert('Permission to access microphone is required.');
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    setRecording(null);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecordingUri(uri);
    Alert.alert('Recording saved!');
  };

  const playRecording = async () => {
    if (recordingUri) {
      const { sound } = await Audio.Sound.createAsync({ uri: recordingUri });
      setSound(sound);
      await sound.playAsync();
    }
  };

  const deleteRecording = () => {
    setRecordingUri(null);
    setSound(null);
    Alert.alert('Recording deleted!');
  };

  return (
    <View style={styles.card}>
      <Text style={styles.wordText}>{word.English}</Text>
      <Button title="Start Recording" onPress={startRecording} />
      <Button title="Stop Recording" onPress={stopRecording} disabled={!recording} />
      {recordingUri && (
        <>
          <Button title="Play Recording" onPress={playRecording} />
          <Button title="Delete Recording" onPress={deleteRecording} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  wordText: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default WordCard;
