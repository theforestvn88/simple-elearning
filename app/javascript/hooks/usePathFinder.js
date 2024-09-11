import { useMemo } from "react"
import { useLocation } from "react-router-dom"

const usePathFinder = () => {
    const location = useLocation()

    const authSuccessPath = useMemo(() => {
        const parts = location.pathname.split("/")
        if (parts[0] === '') {
            parts.shift()
        }
        const authIndex = parts.findIndex(part => part == "auth")
        return authIndex >= 0 ? ('/' + parts.slice(0, authIndex).join("/")) : location.pathname
    }, [location.pathname])

    return {
        authSuccessPath
    }
}

export default usePathFinder
