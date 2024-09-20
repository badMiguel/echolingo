import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './components/navigation/AppNavigator';
import { registerRootComponent } from 'expo';

// ERROR:
// 1. "Invariant Violation: "main" has not been registered. 
// This can happen if: * Metro (the local dev server) is run from the wrong folder. 
// Check if Metro is running, stop it and restart it in the current project."
// -> Solution: https://www.reddit.com/r/reactnative/comments/1b2yu37/comment/ksortk3/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button

export default function App() {
    return (
        <NavigationContainer>
            <AppNavigator />
        </NavigationContainer>
    );
} 

registerRootComponent(App);

