import React, { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react";

export const CategoryContext = createContext<{ category: string }>({ category: 'unknown' });
export const SetCategoryContext = createContext<Dispatch<SetStateAction<string>> | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [category, setCategory] = useState<string>('');

    return (
        <SetCategoryContext.Provider value={setCategory}>
            <CategoryContext.Provider value={{ category }}>
                {children}
            </CategoryContext.Provider>
        </SetCategoryContext.Provider>
    );
};

export function useCategoryContext() {
    return useContext(CategoryContext);
};

export function useSetCategoryContext() {
    const context = useContext(SetCategoryContext);
    if (!context) {
        throw new Error('useSetCategoryContext must be used within a CategoryProvider');
    }

    return context;
}
