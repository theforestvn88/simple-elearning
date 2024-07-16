import React from "react"
import DropZoneComponent from "./DropZone"

const SingleFileDropZone = ({acceptedFiles, maxFilesize, file, droppedFile, removedFile, ...others}) => {
    return (
        <DropZoneComponent
            configs={{
                acceptedFiles: acceptedFiles,
                maxFiles: 1,
                maxFilesize: maxFilesize,
                autoHandleWhenMaxFilesExceeded: true,
                autoProcessQueue: false,
                uploadMultiple: false,
                addRemoveLinks: true,
            }}
            directUpload={false}
            addFileSuccess={droppedFile}
            removeFileSuccess={removedFile}
            existedFiles={[file]}
            className="dropzone-one-file"
            {...others}
        />
    )
}

export default SingleFileDropZone
