import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

function recordingListLayout() {
    return (
        <Stack>
            <Stack.Screen
                name='index'
                options={{
                    headerShown: true,
                    title: 'Recording Database',
                }}
            />
        </Stack>
    );
}

export default recordingListLayout;

const styles = StyleSheet.create({
})
