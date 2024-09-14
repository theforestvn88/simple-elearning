import { useCallback, useMemo } from "react"
import { useLocation } from "react-router-dom"
import { useAppContext } from "../context/AppProvider"

const usePathFinder = () => {
    const location = useLocation()
    const { subject, identify } = useAppContext()

    const authSuccessPath = useMemo(() => {
        const parts = location.pathname.split("/")
        if (parts[0] === '') {
            parts.shift()
        }
        const authIndex = parts.findIndex(part => part == "auth")
        return authIndex >= 0 ? ('/' + parts.slice(0, authIndex).join("/")) : location.pathname
    }, [location.pathname])

    const partnerInstructorProfilePath = useCallback((instructor) => `/partners/${identify}/account/${instructor.id}/profile`)

    const cancelAssignmentApiUrl = useMemo(() => `/api/v1/${subject}/${identify}/assignments/cancel`)

    return {
        authSuccessPath,
        partnerInstructorProfilePath,
        cancelAssignmentApiUrl
    }
}

export default usePathFinder
