import { View, Text } from 'react-native'
import React, { createContext, useEffect, useState } from 'react'
import { Link, router } from 'expo-router';

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
        <View>
            <Text
                onPress={() => login('student', 'Student')}>Student</Text>
            <Text
                onPress={() => login('teacher', 'Teacher')}>Teacher</Text>
        </View>
    )
}
