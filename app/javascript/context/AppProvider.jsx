import React, { createContext, useContext } from "react"
import useAuth from "../hooks/useAuth"

const AppContext = createContext()

const AppProvider = ({ children }) => {
    const { token, user, login, logout, signup } = useAuth()

    return (
        <AppContext.Provider value={{ auth: { token, user, login, logout, signup } }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppProvider

export const useAppContext = () => {
    return useContext(AppContext)
}
