import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'

const CousrseLayout = () => {
    const params = useLocalSearchParams();
    const courseName = typeof params.courseName === 'string' ? params.courseName : 'unknown';

    return (
        <Stack>
            <Stack.Screen
                name='index'
                options={{
                    title: courseName
                }}
            />
        </Stack>
    )
}

export default CousrseLayout

const styles = StyleSheet.create({})
