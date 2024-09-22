import React, { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react";

import { useCategoryContext } from "@/contexts/CategoryContext";
import categoryData from '@/data/json/category_data.json'
import useData from "@/hooks/recording/useData";

export type DataType = {
    id: number;
    English: string | null;
    "Gloss (english)": string | null;
    "Gloss (tiwi)": string | null;
    Tiwi: string | null;
    Topic: string | null;
    "Image Name (optional)": string | null;
    recording: string | null;
    completed: boolean;
};

export const emptyTiwiData = () => {
    return {
        id: 0,
        English: null,
        "Gloss (english)": null,
        "Gloss (tiwi)": null,
        Tiwi: null,
        Topic: null,
        "Image Name (optional)": null,
        recording: null,
        completed: false,
    }
}


const TiwiContext = createContext<DataType | undefined>(undefined);
const SetTiwiContext = createContext<Dispatch<SetStateAction<DataType>> | undefined>(undefined);
const TiwiListContext = createContext<DataType[] | undefined>(undefined);
const UpdateDataContext = createContext<() => void>(() => { });

export const TiwiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentTiwi, setCurrentTiwi] = useState<DataType>(emptyTiwiData);
    const [tiwiData, setTiwiData] = useState<Promise<any>>();
    const [filteredList, setFilteredList] = useState<DataType[] | undefined>(undefined);

    const { category } = useCategoryContext();
    const { loadJson } = useData();

    // todo add error handling
    useEffect(() => {
        const getData = async () => {
            const data = await loadJson()
            setTiwiData(data);
        }
        getData();
    }, []);

    useEffect(() => {
        // todo error handlign
        if (Array.isArray(tiwiData)) {
            // todo optimisation
            const selectedCategory = categoryData.filter(item => item.categoryName === category)
            let tiwiList: DataType[] = tiwiData;
            if (selectedCategory.length > 0) {
                tiwiList = tiwiData.filter(item =>
                    selectedCategory.some(category => category.topic.includes(item.Topic)) &&
                    !item.completed
                );
            }
            setFilteredList(tiwiList);
        }
    }, [tiwiData, category]);

    const updateData = async () => {
        const data = await loadJson();
        // todo error handling
        if (data) {
            setTiwiData(data);
        }
    }

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
}

export function useTiwiContext() {
    return useContext(TiwiContext);
}

export function useSetTiwiContext() {
    const context = useContext(SetTiwiContext);
    if (!context) {
        throw new Error('useSetTiwiContext must be used within a TiwiProvider');
    }
    return context;
}

export const useTiwiListContext = () => {
    return useContext(TiwiListContext);
}

export const useUpdateData = () => {
    return useContext(UpdateDataContext);
}
