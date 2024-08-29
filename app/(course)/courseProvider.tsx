import { useLocalSearchParams } from "expo-router";
import React, { ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react";

export const CourseContext = createContext<{ course: string }>({ course: 'unknown' });

export const CourseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [course, setCourse] = useState<string>('');

    const param = useLocalSearchParams();
    let courseName: string = Array.isArray(param.courseName) ? param.courseName[0] : param.courseName;

    useEffect(() => {
        setCourse(courseName);
    }, [courseName])

    return (
        <CourseContext.Provider value={{ course }}>
            {children}
        </CourseContext.Provider>
    );
};

export const useDharugContext = () => {
    return useContext(CourseContext);
};
