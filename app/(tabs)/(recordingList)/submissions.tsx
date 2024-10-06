import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { collection, query, where, getDocs } from "firebase/firestore";
import AudioPlayback from "@/components/audio/playback";
import { db } from "@/firebase/firebaseConfig";

export default function Submissions() {
    const { sentenceID } = useLocalSearchParams();
    const [submissions, setSubmissions] = useState<any[]>([]);

    useEffect(() => {
        const fetchSubmissions = async () => {
            const q = query(collection(db, "submissions"), where("sentenceId", "==", sentenceID));
            const querySnapshot = await getDocs(q);
            const submissionList = querySnapshot.docs.map((doc) => ({
                recordingUri: doc.data().recordingUrl,
                submittedAt: doc.data().submittedAt,
            }));
            setSubmissions(submissionList);
        };

        if (sentenceID) {
            fetchSubmissions();
        }
    }, [sentenceID]);

    return (
        <View>
            <Text>Student Submissions for Sentence ID: {sentenceID}</Text>
            {submissions.length > 0 ? (
                <FlatList
                    data={submissions}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <View>
                            <Text>Recording {index + 1}</Text>
                            <AudioPlayback uri={item.recordingUri} />
                        </View>
                    )}
                />
            ) : (
                <Text>No submissions yet</Text>
            )}
        </View>
    );
}
