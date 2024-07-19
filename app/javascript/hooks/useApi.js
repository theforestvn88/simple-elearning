import React, { useCallback } from "react"

const convertParams = (contentType, params) => {
    switch(contentType) {
        case 'application/json':
            return JSON.stringify(params)
        case 'multipart/form-data':
        default:
            return params
    }
}

const useApi = () => {
    const Base = ''

    const DefaultHeader = {
        'Content-Type': 'application/json',
    }
    
    const BaseApi = useCallback(async (method, path, headers = {}, params = {}) => {
        const apiUrl = method === 'GET' ? Base + path + (new URLSearchParams(params).toString()) : Base + path
        const apiHeaders = {
            ...DefaultHeader,
            ...headers
        }

        const apiBoby = method !== 'GET' ? convertParams(apiHeaders['Content-Type'], params) : null
        
        // https://muffinman.io/blog/uploading-files-using-fetch-multipart-form-data/
        // Multipart form allow transfer of binary data, therefore server needs a way to know where one field's data ends and where the next one starts.
        // That's where boundary comes in. It defines a delimiter between fields we are sending in our request (similar to & for GET requests). 
        // You can define it yourself, but it is much easier to let browser do it for you.
        if (apiHeaders['Content-Type'] === 'multipart/form-data') {
            delete apiHeaders['Content-Type']
        }

        return fetch(apiUrl, {
            method: method,
            headers: apiHeaders,
            body: apiBoby,
        })
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
