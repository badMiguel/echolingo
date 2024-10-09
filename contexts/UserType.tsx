import React, { ReactNode, createContext, useContext, useState } from "react";

const UserTypeContext = createContext<string | undefined>(undefined);
const SetUserTypeContext = createContext<React.Dispatch<string | undefined> | undefined>(undefined);

export const UserTypeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userType, setUserType] = useState<string>();

    return (
        <UserTypeContext.Provider value={userType}>
            <SetUserTypeContext.Provider value={setUserType}>
                {children}
            </SetUserTypeContext.Provider>
        </UserTypeContext.Provider>
    );
};

export function useUserTypeContext() {
    return useContext(UserTypeContext);
}

export function useSetUserTypeContext() {
    const setUserType = useContext(SetUserTypeContext);
    // todo error handling
    // if (!setUserType) {
    //     console.error("Failed to use SetUserTypeContext");
    // }

    return setUserType;
}
