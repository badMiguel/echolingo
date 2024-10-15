import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ref, listAll, getDownloadURL, getStorage } from "firebase/storage";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db, storage } from "@/firebase/firebaseConfig";

interface Submission {
    id: string;
    sentenceEnglish: string;
    recordingUrl: string;
    submittedAt: string;
}

interface SubmissionsContextType {
    submissions: Submission[];
    isLoading: boolean;
    refreshSubmissions: () => void;
}

const SubmissionsContext = createContext<SubmissionsContextType | undefined>(undefined);

export const useSubmissions = () => {
    const context = useContext(SubmissionsContext);
    if (!context) {
        throw new Error('useSubmissions must be used within a SubmissionsProvider');
    }
    return context;
};

export const SubmissionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSubmissions = async () => {
        setIsLoading(true);
        try {
            const submissionsRef = ref(storage, 'submissions');
            const submissionsSnapshot = await listAll(submissionsRef);

            const submissionPromises = submissionsSnapshot.prefixes.map(async (folderRef) => {
                const folderContent = await listAll(folderRef);
                const sentenceSubmissions = await Promise.all(folderContent.items.map(async (item) => {
                    const url = await getDownloadURL(item);
                    return {
                        id: item.name,
                        sentenceEnglish: folderRef.name.replace(/_/g, ' '),
                        recordingUrl: url,
                        submittedAt: new Date(parseInt(item.name.split('_')[0])).toLocaleString(),
                    };
                }));
                return sentenceSubmissions;
            });

            const allSubmissions = (await Promise.all(submissionPromises)).flat();
            setSubmissions(allSubmissions);
        } catch (error) {
            console.error("Error fetching submissions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();

        // listener for new submissions
        const q = query(collection(db, "submissions"), orderBy("submittedAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const newSubmission = change.doc.data() as Submission;
                    setSubmissions(prev => [newSubmission, ...prev]);
                }
            });
        });

        return () => unsubscribe();
    }, []);

    const refreshSubmissions = () => {
        fetchSubmissions();
    };

    return (
        <SubmissionsContext.Provider value={{ submissions, isLoading, refreshSubmissions }}>
            {children}
        </SubmissionsContext.Provider>
    );
};