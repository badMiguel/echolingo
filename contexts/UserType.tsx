import React, { ReactNode, createContext, useContext, useState } from "react";

const UserTypeContext = createContext<string | undefined>(undefined);
const SetUserTypeContext = createContext<React.Dispatch<string | undefined> | undefined>(undefined);
const UserNameContext = createContext<string | undefined>(undefined);
const SetUserNameContext = createContext<React.Dispatch<string | undefined> | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userType, setUserType] = useState<string>();
    const [userName, setUserName] = useState<string>();

    return (
        <UserTypeContext.Provider value={userType}>
            <SetUserTypeContext.Provider value={setUserType}>
                <UserNameContext.Provider value={userName}>
                    <SetUserNameContext.Provider value={setUserName}>
                        {children}
                    </SetUserNameContext.Provider>
                </UserNameContext.Provider>
            </SetUserTypeContext.Provider>
        </UserTypeContext.Provider>
    );
};

export function useUserNameContext() {
    return useContext(UserNameContext);
}

export function useSetUserNameContext() {
    return useContext(SetUserNameContext);
}

export function useUserTypeContext() {
    return useContext(UserTypeContext);
}

export function useSetUserTypeContext() {
    return useContext(SetUserTypeContext);
}
