import React, {
    Dispatch,
    ReactNode,
    SetStateAction,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { useCategoryContext } from "@/contexts/CategoryContext";
import categoryData from "@/data/json/category_data.json";
import useData from "@/hooks/recording/useData";

// converted json from list of objects to key value pair, where key is the id
// for faster lookups

export type Submission = {
    recordingUri: string;
    submittedAt: string;
};

export type Entry = {
    // based on the data given, assumed that english, tiwi, and topic is not null
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
        completed: complete ? true: false,
        // submissions
        submissions: [] as Submission[]
    }
}


const TiwiContext = createContext<Entry | undefined>(undefined);
const SetTiwiContext = createContext<Dispatch<SetStateAction<Entry>> | undefined>(undefined);
const TiwiListContext = createContext<DataType | undefined>(undefined);
const UpdateDataContext = createContext<() => void>(() => {});

export const TiwiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentTiwi, setCurrentTiwi] = useState<Entry>(emptyTiwiData);
    const [tiwiData, setTiwiData] = useState<DataType>({ "0": emptyTiwiData() });
    const [filteredList, setFilteredList] = useState<DataType | undefined>(undefined);

    const { category } = useCategoryContext();
    const { loadJson } = useData();

    // todo add error handling
    useEffect(() => {
        const getData = async () => {
            const data = await loadJson();
            setTiwiData(data);
        };

        getData();
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

    const updateData = async () => {
        const data = await loadJson();
        // todo error handling
        if (data) {
            setTiwiData(data);
        }
    };

    return (
        <TiwiListContext.Provider value={filteredList}>
            <TiwiContext.Provider value={currentTiwi}>
                <SetTiwiContext.Provider value={setCurrentTiwi}>
                    <UpdateDataContext.Provider value={updateData}>
                        {children}
                    </UpdateDataContext.Provider>
                </SetTiwiContext.Provider>
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
        throw new Error("useSetTiwiContext must be used within a TiwiProvider");
    }
    return context;
}

export const useTiwiListContext = () => {
    return useContext(TiwiListContext);
};

export const useUpdateData = () => {
    return useContext(UpdateDataContext);
};
