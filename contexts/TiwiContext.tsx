import React, {
    ReactNode,
    SetStateAction,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { useCategoryContext } from "@/contexts/CategoryContext";
import categoryData from "@/data/json/category_data.json";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

export type Submission = {
    recordingUri: string;
    submittedAt: string;
};

export type Entry = {
    English: string;
    Tiwi: string;
    Topic: string;
    "Gloss (english)": string | null;
    "Gloss (tiwi)": string | null;
    "Image name (optional)": string | null;
    recording: string | null;
    completed: boolean;
    submissions?: Submission[];
};

export type DataType = {
    [key: string]: Entry;
};

export const emptyTiwiData = (complete?: boolean) => {
    return {
        English: "",
        Tiwi: "",
        Topic: "",
        "Gloss (english)": null,
        "Gloss (tiwi)": null,
        "Image name (optional)": null,
        recording: null,
        completed: complete ? true : false,
        // submissions
        submissions: [] as Submission[],
    };
};

const TiwiContext = createContext<Entry | undefined>(undefined);
const SetTiwiContext = createContext<React.Dispatch<SetStateAction<Entry>> | undefined>(undefined);
const TiwiListContext = createContext<DataType | undefined>(undefined);

export const TiwiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentTiwi, setCurrentTiwi] = useState<Entry>(emptyTiwiData);
    const [tiwiData, setTiwiData] = useState<DataType>({ "0": emptyTiwiData() });
    const [filteredList, setFilteredList] = useState<DataType | undefined>(undefined);

    const { category } = useCategoryContext();

    // todo add error handling
    useEffect(() => {
        const sentenceRef = collection(db, "sentences");

        const unsubscribe = onSnapshot(
            sentenceRef,
            (snapshot) => {
                const sentenceData: DataType = {};
                snapshot.docs.map((doc) => {
                    const item = doc.data() as Entry;
                    sentenceData[doc.id] = {
                        English: item.English,
                        Tiwi: item.Tiwi,
                        Topic: item.Topic,
                        "Gloss (english)": item["Gloss (english)"],
                        "Gloss (tiwi)": item["Gloss (tiwi)"],
                        "Image name (optional)": item["Image name (optional)"],
                        recording: item.recording,
                        completed: item.completed,
                        submissions: undefined,
                    };
                });
                setTiwiData(sentenceData);
            },
            (error) => {
                console.error("Error listening to firestore", error);
            }
        );

        // Clean up the listener on component unmount
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        // todo error handling and optimisation
        const selectedCategory = categoryData.filter((item) => item.categoryName === category);
        let tiwiList: DataType = {};

        if (selectedCategory.length > 0) {
            const filterKeys = Object.keys(tiwiData).filter(
                (key) =>
                    selectedCategory.some((category) =>
                        category.topic.includes(tiwiData[key]["Topic"]!)
                    ) && !tiwiData[key]["completed"]
            );

            for (const key of filterKeys) {
                tiwiList[key] = tiwiData[key];
            }
        } else {
            tiwiList = tiwiData;
        }

        setFilteredList(tiwiList);
    }, [tiwiData, category]);

    return (
        <TiwiListContext.Provider value={filteredList}>
            <TiwiContext.Provider value={currentTiwi}>
                <SetTiwiContext.Provider value={setCurrentTiwi}>{children}</SetTiwiContext.Provider>
            </TiwiContext.Provider>
        </TiwiListContext.Provider>
    );
};

export function useTiwiContext() {
    return useContext(TiwiContext);
}

export function useSetTiwiContext() {
    const context = useContext(SetTiwiContext);
    if (!context) {
        console.error("useSetTiwiContext must be used within a TiwiProvider");
    }
    return context;
}

export const useTiwiListContext = () => {
    return useContext(TiwiListContext);
};
