import React, { createContext, useContext } from "react"
import useAuth from "../hooks/useAuth"

const AppContext = createContext()

const AppProvider = ({ children }) => {
    const { 
        authInfo, 
        login, 
        logout, 
        signup, 
        refreshToken, 
        hasBeenExpiredToken, 
        willExpiredToken,
        clearAuth,
        RequireAuthorizedApi
    } = useAuth()
    
    return (
        <AppContext.Provider value={{ 
            auth: { 
                info: authInfo, 
                login, 
                logout, 
                signup, 
                refreshToken, 
                hasBeenExpiredToken,
                willExpiredToken 
            },
            clearAuth,
            RequireAuthorizedApi
        }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppProvider

export const useAppContext = () => {
    return useContext(AppContext)
}
