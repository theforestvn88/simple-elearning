import React, { createContext, useContext } from "react"
import useAuth from "../hooks/useAuth"

const AppContext = createContext()

const AppProvider = ({ subject, identify, children }) => {
    const { 
        authInfo,
        saveUserInfo, 
        login, 
        logout, 
        signup, 
        refreshToken, 
        hasBeenExpiredToken, 
        willExpiredToken,
        clearAuth,
        changePassword,
        RequireAuthorizedApi
    } = useAuth(subject, identify)
    
    return (
        <AppContext.Provider value={{
            subject,
            identify, 
            auth: { 
                info: authInfo, 
                login, 
                logout, 
                signup, 
                refreshToken, 
                hasBeenExpiredToken,
                willExpiredToken,
                saveUserInfo,
                changePassword,
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
