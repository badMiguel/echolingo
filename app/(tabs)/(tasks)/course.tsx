import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native'
import { useCourseContext } from './courseProvider';

export default function Course() {
    const navigation = useNavigation();
    const { course } = useCourseContext();

    // change header title dynamically
    useEffect(() => {
        if (course !== 'unknown') {
            navigation.setOptions({
                title: course
            })
        }
    }, [navigation])

    return (
        <View>
            <Text></Text>
        </View>
    );
}

function SentenceCard() {
}

const styles = StyleSheet.create({})
