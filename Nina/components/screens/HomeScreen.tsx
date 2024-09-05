import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import styles from '../styles/HomeScreen_style';

export default function HomeScreen({ navigation }: { navigation: any }) {
  // Function to handle navigation and pass the role
  const handleNavigation = (role: 'teacher' | 'student') => {
    navigation.navigate('TopicScreen', { userType: role });  // Pass 'userType' here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>You are a:</Text>
      
      {/* Teacher button */}
      <TouchableOpacity style={styles.option} onPress={() => handleNavigation('teacher')}>
        <Text style={styles.option_txt}>Teacher</Text>
      </TouchableOpacity>
      
      {/* Student button */}
      <TouchableOpacity style={styles.option} onPress={() => handleNavigation('student')}>
        <Text style={styles.option_txt}>Student</Text>
      </TouchableOpacity>
    </View>
  );
}
