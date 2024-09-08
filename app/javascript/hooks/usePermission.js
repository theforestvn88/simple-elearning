import { useCallback } from "react"
import { useAppContext } from "../context/AppProvider"

const usePermission = () => {
    const { auth } = useAppContext()

    const AdministratorRank = 'administrator'
    const canCreateInstructor = useCallback(() => {
        return auth?.info?.user?.rank === AdministratorRank
    }, [auth.info])

    return {
        canCreateInstructor
    }
}

export default usePermission
