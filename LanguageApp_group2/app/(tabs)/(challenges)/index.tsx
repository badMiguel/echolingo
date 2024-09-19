import { ScrollView, View, Text, Button, StyleSheet } from 'react-native';
import React from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function Challenges() {
    const bgColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const tint = useThemeColor({}, 'tint');

    // Mock challenge data (you can replace this with dynamic data)
    const challenges = [
        { id: 1, title: 'Challenge 1', status: 'claim' },
        { id: 2, title: 'Challenge 2', status: 'claim' },
        { id: 3, title: 'Challenge 3', status: 'start' },
        { id: 4, title: 'Challenge 4', status: 'start' },
    ];

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            <Text style={[styles.title, { color: textColor }]}>Your Challenges</Text>
            <ScrollView contentContainerStyle={styles.scrollView}>
                {challenges.map((challenge) => (
                    <View key={challenge.id} style={styles.challengeCard}>
                        <Text style={[styles.challengeText, { color: textColor }]}>
                            {challenge.title}
                        </Text>
                        <Button
                            title={challenge.status === 'claim' ? 'Claim...' : 'Start'}
                            color={tint}
                            onPress={() => console.log(`${challenge.title} pressed`)}
                        />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    scrollView: {
        flexDirection: 'column',
        gap: 20,
    },
    challengeCard: {
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    challengeText: {
        fontSize: 18,
        marginBottom: 10,
    },
});
