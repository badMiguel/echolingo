import React, { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react";

import { useCourseContext } from "@/contexts/CourseContext";
import dharugData from '@/data/json/dharug_list.json'
import courseData from '@/data/json/course_data.json'

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


export const DharugContext = createContext<DataType | undefined>(undefined);
export const SetDharugContext = createContext<Dispatch<SetStateAction<DataType>> | undefined>(undefined);
export const DharugListContext = createContext<DataType[] | undefined>(undefined);

export const DharugProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentDharug, setCurrentDharug] = useState<DataType>(emptyDharugData);
    const { course } = useCourseContext();

    const selectedCourse = courseData.filter(item => item.courseName === course);
    const dharugList: DataType[] = dharugData.filter(item =>
        selectedCourse.some(course => course.topic.includes(item.Topic)) &&
        !item.completed
    );

    return (
        <DharugListContext.Provider value={dharugList}>
            <DharugContext.Provider value={currentDharug}>
                <SetDharugContext.Provider value={setCurrentDharug}>
                    {children}
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
