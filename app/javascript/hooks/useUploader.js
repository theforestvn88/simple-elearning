import React, { useEffect, useState } from "react"
import { DirectUpload } from "@rails/activestorage"
import { useAppContext } from "../context/AppProvider"

class Uploader {
    constructor(uploadUrl, token, file, progressCallback, successCallback) {
        this.progressCallback = progressCallback
        this.successCallback = successCallback

        const headers = { 'X-Auth-Token': `Bearer ${token}` }
        this.upload = new DirectUpload(file, uploadUrl, this, headers)
    }

    uploadFile() {
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
        this.request = request
        request.upload.addEventListener("progress", event => this.directUploadDidProgress(event))
    }

    directUploadDidProgress(event) {
        this.progressCallback((event.loaded/event.total) * 100)
    }

    // TODO: handle cancel uploading file
}

const useUploader = (token, isUploadMultipleFile = false) => {
    const {subject, identify} = useAppContext()
    const [selectedFile, setSelectedFile] = useState(null)
    const [progress, setProgress] = useState(0)
    const [blob, setBlob] = useState(null)

    useEffect(() => {
        if (!selectedFile) return
        
        const uploader = new Uploader(`/api/v1/${subject}/${identify}/presigned_url`, token, selectedFile, setProgress, setBlob)
        uploader.uploadFile()

        return () => {
            uploader.request?.abort()
        }
    }, [selectedFile])

    return [
        setSelectedFile,
        progress,
        blob
    ]
}

export default useUploader
