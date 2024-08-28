import { createContext, useContext } from "react";

export const UserContext = createContext({ userType: '', userName: '' })

export const UseUserContext = () => {useContext(UserContext)}
