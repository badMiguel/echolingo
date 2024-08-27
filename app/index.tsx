import { View, Text } from 'react-native'
import React from 'react'
import { styled } from 'nativewind'
import { Link } from 'expo-router';

const StyledView = styled(View);
const StyledText = styled(Text);


export default function index() {
    return (
        <StyledView className='flex h-screen items-center justify-center flex-row space-x-10'>
            <Link href="/(tabs)?role=student" >
                <StyledText>Student</StyledText>
            </Link>
            <Link href="/(tabs)?role=teacher">
                <StyledText>Teacher</StyledText>
            </Link>
        </StyledView>
    )
}
