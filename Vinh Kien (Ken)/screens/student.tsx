// student.tsx
import React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack'; // Import navigation prop types

// Define the type for the navigation prop using StackScreenProps
type Props = StackScreenProps<any, 'Student'>;

const StudentScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      {/* <Text>Student Screen</Text> */}
      <Button title="Go to Teacher" onPress={() => navigation.navigate('Teacher')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StudentScreen;
