import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { DharugProvider } from '@/contexts/DharugContext'

function recordingListLayout() {
    return (
        <DharugProvider>
            <Stack>
                <Stack.Screen
                    name='index'
                    options={{
                        headerShown: true,
                        title: 'Recording Database',
                    }}
                />
            </Stack>
        </DharugProvider>
    );
}

export default recordingListLayout;

const styles = StyleSheet.create({
})
