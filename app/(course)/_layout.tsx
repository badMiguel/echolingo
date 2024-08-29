import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import { CourseProvider } from './courseProvider';

const CousrseLayout = () => {
    const params = useLocalSearchParams();
    const courseName = typeof params.courseName === 'string' ? params.courseName : 'unknown';

    return (
        <CourseProvider>
            <Stack>
                <Stack.Screen
                    name='index'
                    options={{
                        title: courseName
                    }}
                />
            </Stack>
        </CourseProvider>
    )
}

export default CousrseLayout

const styles = StyleSheet.create({})
