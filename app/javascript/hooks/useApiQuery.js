import React, { useEffect, useState } from "react"
import { useAppContext } from "../context/AppProvider"
import useApi from "./useApi"

const useApiQuery = (path, requiredAuthorized = true, apiVersion = 1) => {
    const { QueryApi } = useApi()
    const { subject, identify, RequireAuthorizedApi } = useAppContext()
    
    const [query, setQuery] = useState(null)
    const [responseData, setResponseData] = useState({ loading: false, error: null, data: {} })

    useEffect(() => {
        if (query === null) return

        setResponseData({data: {}, loading: true, error: null})

        const apiUrl = `/api/v${apiVersion}/${subject}/${identify}${path}`
        const queryRequest = requiredAuthorized ? RequireAuthorizedApi('GET', apiUrl, query) : QueryApi(apiUrl, query)
        queryRequest
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }

                throw new Error('Something went wrong!')
            })
            .then((data) => {
                setResponseData({data: data, loading: false, error: null})
            })
            .catch((error) => {
                console.log(error)
            })
    }, [query])

    return {
        setQuery,
        responseData,
    }
}

export default useApiQuery
