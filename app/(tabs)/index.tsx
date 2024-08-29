import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';

function Home() {
    const params = useLocalSearchParams();
    const userName: string = Array.isArray(params.userName) ? params.userName[0] : params.userName;
    const date = new Date();
    const hours = date.getHours();

    const greetings = (): string => {
        if (hours < 12) {
            return 'Morning';
        } else if (hours < 18) {
            return 'Afternoon';
        } else {
            return 'Evening';
        }
    }

    return (
        <View>
            <Text>Good {greetings()}</Text>
            < Text > Hello, {userName}</Text>
        </View>
    );
}

export default Home;
