import { ReactNode, createContext, useContext, useEffect, useState } from "react";

import { useCourseContext } from "./courseProvider";
import dharugData from '../../data/json/dharug_list.json'
import courseData from '../../data/json/course_data.json'

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

export const DharugContext = createContext<DharugDataType | undefined>(undefined);

export const DharugProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [current, setCurrent] = useState<DharugDataType | undefined>(undefined);

    const courseName = useCourseContext().course;

    const selectedCourse = courseData.filter(course => course.courseName === courseName);
    const dharugList: DharugDataType[] = dharugData.filter(item =>
        selectedCourse.some(course => course.topic.includes(item.Topic)) &&
        !item.completed
    );

    useEffect(() => {
        if (dharugList.length > 0) {
            setCurrent(dharugList[0]);
        } else {
            setCurrent(undefined);
        }
    }, [dharugList]);


    return (
        <DharugContext.Provider value={current} >
            {children}
        </DharugContext.Provider>
    );
}

export const useDharugContext = () => {
    return useContext(DharugContext);
}

