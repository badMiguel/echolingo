import React, { ReactNode, useEffect, createContext, useContext, useState } from "react";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/firebase/firebaseConfig";

const UserTypeContext = createContext<string | undefined>(undefined);
const SetUserTypeContext = createContext<React.Dispatch<string | undefined> | undefined>(undefined);
const UserNameContext = createContext<string | undefined>(undefined);
const SetUserNameContext = createContext<React.Dispatch<string | undefined> | undefined>(undefined);
const ProfilePicContext = createContext<string | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userType, setUserType] = useState<string>();
    const [userName, setUserName] = useState<string>();
    const [profilePicLink, setProfilePicLink] = useState<string>();

    useEffect(() => {
        async function fetchProfilePic() {
            try {
                const storageRef = ref(storage, `profilePic/${userName}`);
                const link = await getDownloadURL(storageRef);

                setProfilePicLink(link);
            } catch (error) {
                setProfilePicLink(undefined);
                console.log("Failed to get profile picture", error);
            }
        }

        if (userName) {
            fetchProfilePic();
        }
    }, [userName]);

    return (
        <UserTypeContext.Provider value={userType}>
            <SetUserTypeContext.Provider value={setUserType}>
                <UserNameContext.Provider value={userName}>
                    <SetUserNameContext.Provider value={setUserName}>
                        <ProfilePicContext.Provider value={profilePicLink}>
                            {children}
                        </ProfilePicContext.Provider>
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

export function useProfilePicContext() {
    return useContext(ProfilePicContext);
}
