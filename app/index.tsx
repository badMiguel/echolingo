import { View, Text, Button, StyleSheet } from 'react-native'
import React, { createContext, useEffect, useState } from 'react'
import { Link, router } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';

export const UserTypeContext = createContext('');

export default function Index() {
    const bgColor = useThemeColor({}, 'background');

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
        <View style={{ flex: 1, backgroundColor: bgColor }}>
            <Button
                onPress={() => login('student', 'Student')}
                title='Student View' />
            <Button
                onPress={() => login('teacher', 'Teacher')}
                title='Teacher View' />
        </View>
    )
}
