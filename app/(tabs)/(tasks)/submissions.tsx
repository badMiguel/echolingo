import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Alert, Switch } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import AudioPlayback from "@/components/audio/playback";
import { db, storage } from "@/firebase/firebaseConfig";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Pressable } from "react-native";
import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

interface Submission {
    id: string;
    recordingUrl: string | null; 
    submittedAt: string;
    status: 'pending' | 'marked';
    score?: number;
    feedback?: string;
    fileName?: string;
}

const useColor = () => {
    return {
        bgColor: useThemeColor({}, "background"),
        textColor: useThemeColor({}, "text"),
        primary: useThemeColor({}, "primary"),
        primary_tint: useThemeColor({}, "primary_tint"),
    };
};

export default function Submissions() {
    const { sentenceID, sentenceEnglish } = useLocalSearchParams<{
        sentenceID: string;
        sentenceEnglish: string;
    }>();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showPending, setshowPending] = useState(false);
    

    const bgColor = useThemeColor({}, "background");
    const primary = useThemeColor({}, "primary");
    const primary_tint = useThemeColor({}, "primary_tint");

    const color = useColor();

    useFocusEffect(
        useCallback(() => {
          fetchSubmissions();
        }, [sentenceID])
    );

    const fetchSubmissions = useCallback(async () => {
        setIsLoading(true);
        try {
            if (!sentenceID) {
                throw new Error("Missing sentence information");
            }
    
            const submissionsRef = collection(db, "submissions");
            const q = query(submissionsRef, 
                where("sentenceId", "in", [sentenceID, "default"])
            );
            const querySnapshot = await getDocs(q);
    
            const submissionList: Submission[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                submissionList.push({
                    id: doc.id,
                    recordingUrl: data.recordingUrl,
                    submittedAt: data.submittedAt.toDate().toLocaleString(),
                    status: data.status || 'pending',
                    score: data.score,
                    feedback: data.feedback
                });
            });
    
            setSubmissions(submissionList);
            console.log(`Fetched ${submissionList.length} submissions for sentence ID: ${sentenceID}`);
            console.log("Submissions:", submissionList);
        } catch (error) {
            console.error("Error fetching submissions:", error);
            Alert.alert("Error", "Failed to load submissions. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [sentenceID]);

    const renderSubmission = ({ item, index }: { item: Submission; index: number }) => (
        <View style={[styles.submissionItem, { backgroundColor: primary_tint }]}>
          <ThemedText type="defaultSemiBold">Submission {index + 1}</ThemedText>
          <ThemedText type="defaultSemiBold">Submitted: {item.submittedAt}</ThemedText>
          <ThemedText type="defaultSemiBold">Status: {item.status}</ThemedText>
          <AudioPlayback uri={item.recordingUrl} fileName={item.fileName} />
          <Pressable
            style={[styles.button, 
                { backgroundColor: item.status == "pending"? "white" : color.primary, },
                ]}
            onPress={() => router.push({
              pathname: "/viewScores",
              params: { submissionId: item.id, recordingUrl: item.recordingUrl, fileName: item.fileName }
            })}
            disabled={item.status === "pending"}
          >
            {item.status === "pending" ? (
              <ThemedText type="defaultSemiBold">Not graded</ThemedText>
            ) : (
              <ThemedText type="defaultSemiBold" style={{ color: bgColor }}>View</ThemedText>
            )}
          </Pressable>        
        </View>
    );

    const filteredSubmissions = submissions.filter(sub => showPending ? sub.status === 'pending' : sub.status === 'marked');

    return (
        console.log(filteredSubmissions.length),
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            <ThemedText type="subtitle">Submissions for: {sentenceEnglish}</ThemedText>
            <View style={styles.toggleContainer}>
                <ThemedText type="subtitle">Show Pending</ThemedText>
                <Switch
                    value={showPending}
                    onValueChange={setshowPending}
                    trackColor={{ false: primary_tint, true: primary }}
                />
            </View>
            {isLoading ? (
                <ThemedText>Loading submissions...</ThemedText>
            ) : filteredSubmissions.length > 0 ? (
                <FlatList
                    data={filteredSubmissions}
                    keyExtractor={(item) => item.id}
                    renderItem={renderSubmission}
                    contentContainerStyle={styles.listContent}
                />
            ) : (
                <ThemedText>No {showPending ? 'pending' : 'marked'} submissions yet for this sentence.</ThemedText>
            )}
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
        marginTop: 10,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignItems: "center",
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
});
