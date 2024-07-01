import React, { useMemo } from "react"

const useApi = () => {
    const Base = ''

    const DefaultHeader = {
        'Content-Type': 'application/json',
    }
    
    const BaseApi = useMemo(() => {
        return async (method, path, headers = {}, params = {}) => {
            const apiUrl = method === 'GET' ? Base + path + (new URLSearchParams(params).toString()) : Base + path
            const apiBoby = method !== 'GET' ? JSON.stringify(params) : null
            return fetch(apiUrl, {
                method: method,
                headers: {
                    ...DefaultHeader,
                    ...headers
                },
                body: apiBoby,
            })
        }
    }, [])

    // TODO:
    // ThrottleApi
    // CacheDataApi
    //

    return {
        BaseApi
    }
}

export default useApi
