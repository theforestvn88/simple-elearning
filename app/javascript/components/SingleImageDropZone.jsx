import React from "react"
import DropZoneComponent from "./DropZone"

const SingleImageDropZone = ({acceptedFiles, image, selectImage, unselectImage, ...others}) => {
    return (
        <DropZoneComponent
            configs={{
                acceptedFiles: acceptedFiles,
                maxFiles: 1,
                autoHandleWhenMaxFilesExceeded: true,
                autoProcessQueue: false,
                uploadMultiple: false,
                addRemoveLinks: true,
                upload: false,
            }}
            addFileSuccess={selectImage}
            removeFileSuccess={unselectImage}
            existedFiles={[image]}
            className="dropzone-one-file"
            {...others}
        />
    )
}

export default SingleImageDropZone
