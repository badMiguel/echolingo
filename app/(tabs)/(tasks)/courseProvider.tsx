import React, { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react";

export const CourseContext = createContext<{ course: string }>({ course: 'unknown' });
export const SetCourseContext = createContext<Dispatch<SetStateAction<string>> | undefined>(undefined);

export const CourseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [course, setCourse] = useState<string>('');

    return (
        <SetCourseContext.Provider value={setCourse}>
            <CourseContext.Provider value={{ course }}>
                {children}
            </CourseContext.Provider>
        </SetCourseContext.Provider>
    );
};

export function useCourseContext() {
    return useContext(CourseContext);
};

export function useSetCourseContext() {
    const context = useContext(SetCourseContext);
    if (context === undefined) {
        throw new Error('useSetCourseContext must be used within a CourseProvider');
    }

    return context;
}
