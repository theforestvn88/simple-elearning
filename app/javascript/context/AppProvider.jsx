import React, { createContext, useContext, useMemo } from "react"
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
    
    const userType = useMemo(() => {
        if (subject === 'partner') {
            return 'instructor'
        } else {
            return 'user'
        }
    })

    return (
        <AppContext.Provider value={{
            subject,
            identify,
            userType, 
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
