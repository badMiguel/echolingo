import React, { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react";

import { useCourseContext } from "@/contexts/CourseContext";
import courseData from '@/data/json/course_data.json'
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

    const { course } = useCourseContext();
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
        if (Array.isArray(tiwiData)) {
            const selectedCourse = courseData.filter(item => item.courseName === course)
            let tiwiList: DataType[] = tiwiData;
            if (selectedCourse.length > 0) {
                tiwiList = tiwiData.filter(item =>
                    selectedCourse.some(course => course.topic.includes(item.Topic)) &&
                    !item.completed
                );
            }
            setFilteredList(tiwiList);
        }
    }, [tiwiData, course]);

    const updateData = async () => {
        const data = await loadJson();
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
