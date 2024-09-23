import { useCallback } from "react"
import { useAppContext } from "../context/AppProvider"

const usePermission = () => {
    const { auth } = useAppContext()

    const AdministratorRank = 'administrator'
    const isAdmin = useCallback(() => {
        return auth?.info?.user?.rank === AdministratorRank
    }, [auth.info])

    const canCreateInstructor = useCallback(() => {
        return isAdmin()
    }, [])

    const canUpdatePartnerSettings = useCallback(() => {
        return isAdmin()
    })

    return {
        isAdmin,
        canCreateInstructor,
        canUpdatePartnerSettings
    }
}

export default usePermission
