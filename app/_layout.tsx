import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

function RootLayout() {
    return (
        <Stack>
            <Stack.Screen
                name='(tabs)'
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name='index'
                options={{
                    headerShown: true,
                    title: 'Choose User Type',
                }}
            />
        </Stack>
    )
}

export default RootLayout

const styles = StyleSheet.create({})
