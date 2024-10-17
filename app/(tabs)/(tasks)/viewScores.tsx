import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput, Alert, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Pressable } from "react-native";

const useColor = () => {
    return {
        bgColor: useThemeColor({}, "background"),
        textColor: useThemeColor({}, "text"),
        primary: useThemeColor({}, "primary"),
        primary_tint: useThemeColor({}, "primary_tint"),
    };
};

export default function MarkSubmission() {
    const { submissionId } = useLocalSearchParams<{
        submissionId: string,
    }>();
    const [score, setScore] = useState("");
    const [feedback, setFeedback] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const bgColor = useThemeColor({}, "background");
    const primary = useThemeColor({}, "primary");
    const primary_tint = useThemeColor({}, "primary_tint");

    const color = useColor();

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

    if (isLoading) {
        return <View style={[styles.container, { backgroundColor: bgColor }]}><ThemedText>Loading...</ThemedText></View>;
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: bgColor }]}>
            <View style={styles.inputContainer}>
                <ThemedText>
                    <ThemedText type="defaultSemiBold">Score (out of 10): </ThemedText>
                    <ThemedText>{score}</ThemedText>
                </ThemedText>
            </View>
            <View style={styles.inputContainer}>
                <ThemedText type="defaultSemiBold">Feedback:</ThemedText> 
                <ThemedText
                    style={[styles.input, styles.feedbackInput, { backgroundColor: primary_tint }]}
                >
                    {feedback}
                </ThemedText>
            </View>

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