import { View, Text } from 'react-native'
import React, { createContext, useEffect, useState } from 'react'
import { styled } from 'nativewind'
import { Link, router } from 'expo-router';

const StyledView = styled(View);
const StyledText = styled(Text);

export const UserTypeContext = createContext('');

export default function Index() {

    const login = (type: string, name: string) => {
        router.push({
            pathname: '/(tabs)',
            params: {
                userType: type,
                userName: name,
            }
        })
    }

    return (
        <StyledView className='flex h-screen items-center justify-center flex-row space-x-40'>
            <StyledText
                className='bg-[#ADD8E6] p-5'
                onPress={() => login('student', 'Student')}>Student</StyledText>
            <StyledText
                className='bg-[#ADD8E6] p-5'
                onPress={() => login('teacher', 'Teacher')}>Teacher</StyledText>
        </StyledView>
    )
}
