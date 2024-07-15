import React, { useEffect, useState } from "react"
import { DirectUpload } from "@rails/activestorage"

class Uploader {
    constructor(token, file, progressCallback, successCallback) {
        this.progressCallback = progressCallback
        this.successCallback = successCallback

        const headers = { 'X-Auth-Token': `Bearer ${token}` }
        this.upload = new DirectUpload(file, '/api/v1/presigned_url', this, headers)
    }

    uploadFile(file) {
        this.upload.create((error, blob) => {
            if (error) {
                console.log(error)
            } else {
                // Use the with blob.signed_id as a file reference in next request
                this.successCallback(blob)
            }
        })
    }
    
    directUploadWillStoreFileWithXHR(request) {
        request.upload.addEventListener("progress",
            event => this.directUploadDidProgress(event))
    }

    directUploadDidProgress(event) {
        this.progressCallback((event.loaded/event.total) * 100)
    }
}

const useUploader = (token, isUploadMultipleFile = false) => {
    const [file, setFile] = useState(null)
    const [progress, setProgress] = useState(0)
    const [blob, setBlob] = useState(null)

    useEffect(() => {
        if (!file) return

        const uploader = new Uploader(token, file, setProgress, setBlob)
        uploader.uploadFile(file)
    }, [file])

    return [
        setFile,
        progress,
        blob
    ]
}

export default useUploader
