import React, { useCallback } from "react"
import useRequest from "./useRequest"

const useApi = () => {
    const { CallRequest } = useRequest()

    const QueryApi = useCallback(async (path, params = {}, headers = {}) => {
        const urlParams = (new URLSearchParams(params)).toString()
        const apiUrl = path + (!!urlParams ? ('?' + urlParams) : '')
        const apiHeaders = {
            'Content-Type': 'application/json',
            ...headers
        }

        return CallRequest(apiUrl, {
            method: 'GET',
            headers: apiHeaders,
            body: null,
        })
    }, [])

    const SubmitApi = useCallback(async (method, path, params, headers = {}) => {
        let apiBody
        if (params instanceof FormData) {
            apiBody = params
            // https://muffinman.io/blog/uploading-files-using-fetch-multipart-form-data/
            // Multipart form allow transfer of binary data, therefore server needs a way to know where one field's data ends and where the next one starts.
            // That's where boundary comes in. It defines a delimiter between fields we are sending in our request (similar to & for GET requests). 
            // You can define it yourself, but it is much easier to let browser do it for you.
            if (headers['Content-Type'] === 'multipart/form-data') {
                delete headers['Content-Type']
            }
        } else {
            headers['Content-Type'] = 'application/json'
            apiBody = JSON.stringify(params)
        }

        return CallRequest(path, {
            method: method,
            headers: headers,
            body: apiBody,
        })
    })

    // TODO:
    // ThrottleApi
    // CacheDataApi
    //

    return {
        QueryApi,
        SubmitApi
    }
}

export default useApi
