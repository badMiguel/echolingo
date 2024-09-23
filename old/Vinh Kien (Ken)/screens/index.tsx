// index.tsx (Main entry file for stack navigation)
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TeacherScreen from './teacher';
import StudentScreen from './student';

const Stack = createStackNavigator();

const Index = () => {
  return (
    <Stack.Navigator initialRouteName="Teacher">
      <Stack.Screen name="Teacher" component={TeacherScreen} />
      <Stack.Screen name="Student" component={StudentScreen} />
    </Stack.Navigator>
  );
};

export default Index;
