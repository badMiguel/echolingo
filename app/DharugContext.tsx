import React, { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react";

import { useCourseContext } from "@/contexts/CourseContext";
import dharugData from '@/data/json/dharug_list.json'
import courseData from '@/data/json/course_data.json'

export type DharugDataType = {
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

const empty = {
    "id": 0,
    "English": null,
    "Gloss (english)": null,
    "Dharug(Gloss)": null,
    "Dharug": null,
    "Topic": "",
    "Image Name (optional)": null,
    "recording": null,
    "completed": false
}

export const DharugContextID = createContext<number | undefined>(undefined);
export const SetDharugContextID = createContext<Dispatch<SetStateAction<number>> | undefined>(undefined);
export const DharugListContext = createContext<DharugDataType[] | undefined>(undefined);

export const DharugProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentDharug, setCurrentDharug] = useState<number>(0);
    const { course } = useCourseContext();

    const selectedCourse = courseData.filter(item => item.courseName === course);
    const dharugList: DharugDataType[] = dharugData.filter(item =>
        selectedCourse.some(course => course.topic.includes(item.Topic)) &&
        !item.completed
    );

    return (
        <DharugListContext.Provider value={dharugList}>
            <DharugContextID.Provider value={currentDharug}>
                <SetDharugContextID.Provider value={setCurrentDharug}>
                    {children}
                </SetDharugContextID.Provider>
            </DharugContextID.Provider>
        </DharugListContext.Provider>
    );
}

export function useDharugContextID() {
    return useContext(DharugContextID);
}

export function useSetDharugContextID() {
    const context =useContext(SetDharugContextID);
    if (!context) {
        throw new Error('useSetDharugContextID must be used within a DharugProvider');
    }
    return context;
}

export const useDharugListContext = () => {
    return useContext(DharugListContext);
}
