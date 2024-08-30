import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { router, useLocalSearchParams } from 'expo-router';

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
            <Text>Hello, {userName}</Text>
            <Button title='home DELETE THIS' onPress={() => router.navigate('/')} />
        </View>
    );
}

export default Home;
