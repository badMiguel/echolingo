import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput, Alert, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Pressable } from "react-native";


export default function MarkSubmission() {
    const { submissionId, refreshKey } = useLocalSearchParams<{
        submissionId: string,
        refreshKey: string
    }>();
    const [score, setScore] = useState("");
    const [feedback, setFeedback] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const bgColor = useThemeColor({}, "background");
    const primary = useThemeColor({}, "primary");
    const primary_tint = useThemeColor({}, "primary_tint");

    useEffect(() => {
        fetchSubmissionData();
    }, [submissionId]);

    const fetchSubmissionData = async () => {
        if (!submissionId) return;

        try {
            const docRef = doc(db, "submissions", submissionId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setScore(data.score?.toString() || "");
                setFeedback(data.feedback || "");
            } else {
                console.log("No such document!");
                Alert.alert("Error", "Submission not found.");
            }
        } catch (error) {
            console.error("Error fetching submission data:", error);
            Alert.alert("Error", "Failed to load submission data.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!submissionId) {
            Alert.alert("Error", "Invalid submission ID.");
            return;
        }

        if (!score) {
            Alert.alert("Error", "Please provide a score.");
            return;
        }

        const scoreNum = parseInt(score);
        if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 10) {
            Alert.alert("Error", "Please provide a valid score between 0 and 10.");
            return;
        }

        try {
            const docRef = doc(db, "submissions", submissionId);
            await updateDoc(docRef, {
                score: scoreNum,
                feedback,
                status: 'marked'
            });
            Alert.alert("Success", "Submission marked successfully.");

            // back to submissions screen
            router.back();
            router.setParams({ refreshKey: (parseInt(refreshKey) + 1).toString() });
        } catch (error) {
            console.error("Error updating submission:", error);
            Alert.alert("Error", "Failed to update submission.");
        }
    };

    if (isLoading) {
        return <View style={[styles.container, { backgroundColor: bgColor }]}><ThemedText>Loading...</ThemedText></View>;
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: bgColor }]}>
            <View style={styles.inputContainer}>
                <ThemedText type="defaultSemiBold">Score (out of 10):</ThemedText>
                <TextInput
                    style={[styles.input, { backgroundColor: primary_tint }]}
                    value={score}
                    onChangeText={setScore}
                    keyboardType="numeric"
                    maxLength={2}
                    placeholder="Enter score (0-10)"
                    placeholderTextColor="#999"
                />
            </View>
            <View style={styles.inputContainer}>
                <ThemedText type="defaultSemiBold">Feedback:</ThemedText>
                <TextInput
                    style={[styles.input, styles.feedbackInput, { backgroundColor: primary_tint }]}
                    value={feedback}
                    onChangeText={setFeedback}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    placeholder="Enter feedback (optional)"
                    placeholderTextColor="#999"
                />
            </View>
            <Pressable
                style={[styles.button, { backgroundColor: primary }]}
                onPress={handleUpdate}
            >
                <ThemedText type="defaultSemiBold" style={{ color: bgColor }}>
                    {score || feedback ? "Update" : "Submit"}
                </ThemedText>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
    },
    inputContainer: {
        marginVertical: 10,
    },
    input: {
        borderRadius: 5,
        padding: 10,
        marginTop: 5,
    },
    feedbackInput: {
        height: 150,
        textAlignVertical: 'top',
        paddingTop: 10,
    },
    button: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
    },
});