import React, { useEffect } from "react"
import SingleFileDropZone from "./SingleFileDropZone"
import useUploader from "../hooks/useUploader"
import { useAppContext } from "../context/AppProvider"

const SingleFileUploader = ({uploadedFile, unloadedFile, ...props}) => {
    const { auth } = useAppContext()
    const [uploadFile, progress, blob] = useUploader(auth.info.token)

    // TODO: cancel uploading file
    useEffect(() => {
        if (!blob) return

        uploadedFile(blob.signed_id)
    }, [blob])

    return (
        <SingleFileDropZone 
            {...props}
            directUpload={true}
            droppedFile={uploadFile}
            removedFile={unloadedFile}
            uploadedProgress={progress}
            uploadedFile={blob}
        />
    )
}

export default SingleFileUploader
