import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import AudioPlayback from "@/components/audio/playback";
import { storage } from "@/firebase/firebaseConfig";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Pressable } from "react-native";

interface Submission {
    id: string;
    recordingUrl: string;
    submittedAt: string;
}

export default function Submissions() {
    const { sentenceID, sentenceEnglish } = useLocalSearchParams<{
        sentenceID: string;
        sentenceEnglish: string;
    }>();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const bgColor = useThemeColor({}, "background");
    const primary = useThemeColor({}, "primary");
    const primary_tint = useThemeColor({}, "primary_tint");

    useEffect(() => {
        const fetchSubmissions = async () => {
            setIsLoading(true);
            try {
                if (!sentenceID || !sentenceEnglish) {
                    throw new Error("Missing sentence information");
                }

                const folderName = sentenceEnglish.replace(/[^a-z0-9]/gi, "_").toLowerCase();
                const storageRef = ref(storage, `submissions/${folderName}`);

                const result = await listAll(storageRef);
                const submissionPromises = result.items.map(async (item) => {
                    const url = await getDownloadURL(item);
                    return {
                        id: item.name,
                        recordingUrl: url,
                        submittedAt: new Date(parseInt(item.name.split("_")[0])).toLocaleString(),
                    };
                });

                const submissionList = await Promise.all(submissionPromises);
                setSubmissions(submissionList);
            } catch (error) {
                console.error("Error fetching submissions:", error);
                Alert.alert("Error", "Failed to load submissions. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        if (sentenceID && sentenceEnglish) {
            fetchSubmissions();
        } else {
            Alert.alert("Error", "Invalid sentence information");
            router.back();
        }
    }, [sentenceID, sentenceEnglish]);

    const renderSubmission = ({ item, index }: { item: Submission; index: number }) => (
        <View style={[styles.submissionItem, { backgroundColor: primary_tint }]}>
            <ThemedText type="defaultSemiBold">Submission {index + 1}</ThemedText>
            <ThemedText>Submitted: {item.submittedAt}</ThemedText>
            <AudioPlayback uri={item.recordingUrl} />
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            <ThemedText type="subtitle">Submissions for: {sentenceEnglish}</ThemedText>
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
        alignItems: "center",
    },
});
