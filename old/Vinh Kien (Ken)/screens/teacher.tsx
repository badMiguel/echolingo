import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import WordCard from '../components/WordCard';
import wordData from '../data/dharug_list.json'; // JSON word data

const TeacherScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Teacher Screen</Text>
            {/* Render a FlatList to display WordCard for each item in wordData */}
      <FlatList
        data={wordData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <WordCard word={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
});

export default TeacherScreen;
