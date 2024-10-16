import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ref, listAll, getDownloadURL } from "firebase/storage";
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
    refreshSubmissions: () => Promise<void>;
}

const SubmissionsContext = createContext<SubmissionsContextType | undefined>(undefined);

export const useSubmissions = () => {
    const context = useContext(SubmissionsContext);
    if (!context) {
        throw new Error("useSubmissions must be used within a SubmissionsProvider");
    }
    return context;
};

export const SubmissionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSubmissions = async () => {
        console.log("Fetching submissions...");
        setIsLoading(true);
        try {
            const submissionsRef = ref(storage, "submissions");
            const submissionsSnapshot = await listAll(submissionsRef);
            console.log("Submissions folders:", submissionsSnapshot.prefixes.length);

            const submissionPromises = submissionsSnapshot.prefixes.map(async (folderRef) => {
                const folderContent = await listAll(folderRef);
                console.log(`Folder ${folderRef.name} contents:`, folderContent.items.length);
                const sentenceSubmissions = await Promise.all(
                    folderContent.items.map(async (item) => {
                        const url = await getDownloadURL(item);
                        return {
                            id: item.name,
                            sentenceEnglish: folderRef.name.replace(/_/g, " "),
                            recordingUrl: url,
                            submittedAt: new Date(
                                parseInt(item.name.split("_")[0])
                            ).toLocaleString(),
                        };
                    })
                );
                return sentenceSubmissions;
            });

            const allSubmissions = (await Promise.all(submissionPromises)).flat();
            console.log("Total submissions fetched:", allSubmissions.length);
            setSubmissions(allSubmissions);
        } catch (error) {
            console.error("Error fetching submissions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();

        const q = query(collection(db, "submissions"), orderBy("submittedAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log("Firestore snapshot received, changes:", snapshot.docChanges().length);
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const newSubmission = change.doc.data() as Submission;
                    // console.log("New submission added:", newSubmission);
                    setSubmissions((prev) => [newSubmission, ...prev]);
                }
            });
        });

        return () => unsubscribe();
    }, []);

    const refreshSubmissions = async () => {
        console.log("Refreshing submissions...");
        await fetchSubmissions();
    };

    // console.log("SubmissionsProvider rendering, submissions count:", submissions.length);

    return (
        <SubmissionsContext.Provider value={{ submissions, isLoading, refreshSubmissions }}>
            {children}
        </SubmissionsContext.Provider>
    );
};
