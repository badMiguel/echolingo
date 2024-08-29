import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import { CourseProvider } from './courseProvider';
import { DharugProvider } from './dharugProvider';

const CousrseLayout = () => {
    const params = useLocalSearchParams();
    const courseName = typeof params.courseName === 'string' ? params.courseName : 'unknown';

    return (
        <CourseProvider>
            <DharugProvider>
                <Stack>
                    <Stack.Screen
                        name='index'
                        options={{
                            title: courseName
                        }}
                    />
                    <Stack.Screen
                        name='courseGame'
                        options={{
                            title: courseName
                        }}
                    />
                </Stack>
            </DharugProvider>
        </CourseProvider>
    )
}

export default CousrseLayout

const styles = StyleSheet.create({})
