import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import AudioPlayback from "@/components/audio/playback";
import { db } from "@/firebase/firebaseConfig";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Pressable } from "react-native";

interface Submission {
    id: string;
    recordingUrl: string;
    submittedAt: Timestamp;
}
  

export default function Submissions() {
    const { sentenceID, sentenceText } = useLocalSearchParams<{ sentenceID: string, sentenceText: string }>();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const bgColor = useThemeColor({}, "background");
    const primary = useThemeColor({}, "primary");
    const primary_tint = useThemeColor({}, "primary_tint");

    useEffect(() => {
        const fetchSubmissions = async () => {
            setIsLoading(true);
            try {
                // verify sentenceID and sentenceText
                if (!sentenceID || !sentenceText) {
                    throw new Error("Missing sentence information");
                }

                const q = query(collection(db, "submissions"), where("sentenceId", "==", sentenceID));
                const querySnapshot = await getDocs(q);
                const submissionList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    recordingUrl: doc.data().recordingUrl,
                    submittedAt: doc.data().submittedAt,
                }));
                setSubmissions(submissionList);
            } catch (error) {
                console.error("Error fetching submissions:", error);
                Alert.alert("Error", "Failed to load submissions. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        if (sentenceID && sentenceText) {
            fetchSubmissions();
        } else {
            Alert.alert("Error", "Invalid sentence information");
            router.back();
        }
    }, [sentenceID, sentenceText]);

    const renderSubmission = ({ item, index }: { item: Submission; index: number }) => (
        <View style={[styles.submissionItem, { backgroundColor: primary_tint }]}>
            <ThemedText type="defaultSemiBold">Submission {index + 1}</ThemedText>
            <ThemedText>Submitted: {item.submittedAt.toDate().toLocaleString()}</ThemedText>
            <AudioPlayback uri={item.recordingUrl} />
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            <ThemedText type="subtitle">Submissions for: {sentenceText}</ThemedText>
            {isLoading ? (
                <ThemedText>Loading submissions...</ThemedText>
            ) : submissions.length > 0 ? (
                <FlatList
                    data={submissions}
                    keyExtractor={(item) => item.id}
                    renderItem={renderSubmission}
                    contentContainerStyle={styles.listContent}
                />
            ) : (
                <ThemedText>No submissions yet for this sentence.</ThemedText>
            )}
            <Pressable
                style={[styles.button, { backgroundColor: primary }]}
                onPress={() => router.back()}
            >
                <ThemedText type="defaultSemiBold" style={{ color: bgColor }}>
                    Back
                </ThemedText>
            </Pressable>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
    },
    listContent: {
        paddingVertical: 20,
    },
    submissionItem: {
        marginBottom: 20,
        padding: 15,
        borderRadius: 10,
    },
    button: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
});