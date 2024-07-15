import React from "react"
import DropZoneComponent from "./DropZone"

const SingleFileDropZone = ({acceptedFiles, file, droppedFile, undroppedFile, ...others}) => {
    return (
        <DropZoneComponent
            configs={{
                acceptedFiles: acceptedFiles,
                maxFiles: 1,
                autoHandleWhenMaxFilesExceeded: true,
                autoProcessQueue: false,
                uploadMultiple: false,
                addRemoveLinks: true,
            }}
            directUpload={false}
            addFileSuccess={droppedFile}
            removeFileSuccess={undroppedFile}
            existedFiles={[file]}
            className="dropzone-one-file"
            {...others}
        />
    )
}

export default SingleFileDropZone