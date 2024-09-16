import React, { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react";

import { useCourseContext } from "@/contexts/CourseContext";
import courseData from '@/data/json/course_data.json'
import useData from "@/hooks/recording/useData";

export type DataType = {
    id: number;
    English: string | null;
    "Gloss (english)": string | null;
    "Dharug(Gloss)": string | null;
    Dharug: string | null;
    Topic: string | null;
    "Image Name (optional)": string | null;
    recording: string | null;
    completed: boolean;
};

export const emptyDharugData = () => {
    return {
        id: 0,
        English: null,
        "Gloss (english)": null,
        "Dharug(Gloss)": null,
        Dharug: null,
        Topic: null,
        "Image Name (optional)": null,
        recording: null,
        completed: false,
    }
}


const DharugContext = createContext<DataType | undefined>(undefined);
const SetDharugContext = createContext<Dispatch<SetStateAction<DataType>> | undefined>(undefined);
const DharugListContext = createContext<DataType[] | undefined>(undefined);
const UpdateDataContext = createContext<() => void>(() => { });

export const DharugProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentDharug, setCurrentDharug] = useState<DataType>(emptyDharugData);
    const [dharugData, setDharugData] = useState<Promise<any>>();
    const [filteredList, setFilteredList] = useState<DataType[] | undefined>(undefined);

    const { course } = useCourseContext();
    const { loadJson } = useData();

    // todo add error handling
    useEffect(() => {
        const getData = async () => {
            const data = await loadJson()
            setDharugData(data);
        }
        getData();
    }, []);

    useEffect(() => {
        if (Array.isArray(dharugData)) {
            const selectedCourse = courseData.filter(item => item.courseName === course)
            let dharugList: DataType[] = dharugData;
            if (selectedCourse.length > 0) {
                dharugList = dharugData.filter(item =>
                    selectedCourse.some(course => course.topic.includes(item.Topic)) &&
                    !item.completed
                );
            }
            setFilteredList(dharugList);
        }
    }, [dharugData, course]);

    const updateData = async () => {
        const data = await loadJson();
        if (data) {
            setDharugData(data);
        }
    }

    return (
        <DharugListContext.Provider value={filteredList}>
            <DharugContext.Provider value={currentDharug}>
                <SetDharugContext.Provider value={setCurrentDharug}>
                    <UpdateDataContext.Provider value={updateData}>
                        {children}
                    </UpdateDataContext.Provider>
                </SetDharugContext.Provider>
            </DharugContext.Provider>
        </DharugListContext.Provider>
    );
}

export function useDharugContext() {
    return useContext(DharugContext);
}

export function useSetDharugContext() {
    const context = useContext(SetDharugContext);
    if (!context) {
        throw new Error('useSetDharugContext must be used within a DharugProvider');
    }
    return context;
}

export const useDharugListContext = () => {
    return useContext(DharugListContext);
}

export const useUpdateData = () => {
    return useContext(UpdateDataContext);
}
