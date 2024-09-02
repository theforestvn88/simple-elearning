import { useCallback } from "react"

const useRequest = () => {
    const CallRequest = useCallback(async (url, options) => {
        // use fetch by default
        return fetch(url, options)
    }, [])

    return {
        CallRequest
    }
}

export default useRequest
