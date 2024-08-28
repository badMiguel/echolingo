import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { styled } from 'nativewind';
import { useLocalSearchParams } from 'expo-router';

const StyledView = styled(View);

function Home() {
    const params = useLocalSearchParams();
    const userName = params.userName
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
        <StyledView className='flex justify-center items-center' >
            <Text>Good {greetings()}</Text>
            < Text > Hello, {userName}</Text>
        </StyledView>
    );
}

export default Home;
