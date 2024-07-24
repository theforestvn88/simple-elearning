import React, { useEffect, useRef, useState } from "react"
import Dropzone from "dropzone"

Dropzone.autoDiscover = false

const DropZoneComponent = ({configs, init, directUpload, uploadedProgress, uploadedFile, addFileSuccess, removeFileSuccess, existedFiles, className, ...others}) => {
    const dropzoneRef = useRef(null)
    const [thisDropZone, setThisDropZone] = useState(null)

    const showPreview = (file) => {
        if(!thisDropZone || !file) return

        let mockFile = {
          name: file.name,
          size: file.byte_size,
          dataURL: file.url,
          imageUrl: file.url,
          accepted: true,
          uploaded: true,
          type: 'image/png'
        }

        thisDropZone.displayExistingFile(mockFile, file.url)
    }

    // create dropzone
    useEffect(() => {
        // NOT use dropzone.js buil-in upload
        configs.url = 'no-upload'
        configs.autoProcessQueue = false

        setThisDropZone(new Dropzone(dropzoneRef.current, configs))
    }, [dropzoneRef])

    // setup dropzone after it created
    useEffect(() => {
        if (!thisDropZone) return

        if (typeof(init) === 'function') {
            init(thisDropZone)
        }
        
        thisDropZone.on('addedfile', (file) => {
            if (configs.autoHandleWhenMaxFilesExceeded) {
                const currAcceptedFiles = thisDropZone.getAcceptedFiles()
                if(currAcceptedFiles.length >= configs.maxFiles) {
                    let firstFile = currAcceptedFiles[0]
                    thisDropZone.removeFile(firstFile)
                }
            }
            
            if (typeof(addFileSuccess) === 'function' && !file.uploaded) {
                addFileSuccess(file)
            }

            if (!directUpload) { // force complete if in not-upload mode
                thisDropZone.emit("complete", file)
            }
        })

        if (removeFileSuccess) {
            thisDropZone.on('removedfile', removeFileSuccess)
        }

    }, [thisDropZone])

    useEffect(() => {
        if (!thisDropZone) return
        
        if (existedFiles) {
            existedFiles.forEach(file => showPreview(file))
        }
    }, [existedFiles])

    useEffect(() => {
        if (!thisDropZone) return
        if (!uploadedProgress) return

        dropzoneRef.current.querySelector(".dz-upload").style.width = `${uploadedProgress}%`
    }, [uploadedProgress])

    useEffect(() => {
        if (!thisDropZone) return
        if (!uploadedFile) return
        
        const file = thisDropZone.getAcceptedFiles().find((f) => f.name == uploadedFile.filename && f.size == uploadedFile.byte_size)
        if (file) {
            thisDropZone.emit("complete", file)
        }
    }, [uploadedFile])

    return (
        <>
            <div className={`dropzone dropzone-default dz-clickable ${className}`} ref={dropzoneRef} {...others}>
                <div className="dropzone-msg dz-message text-black-50">
                    {directUpload ? (
                        <h5 className="dropzone-msg-title">Drop file here to upload or click here to browse</h5>
                    ) : (
                        <h5 className="dropzone-msg-title">Drop file here or click here to browse</h5>
                    )}
                    <span className="dropzone-msg-desc">{(configs.maxFilesize/1000).toFixed(1)} MB file size maximum. Allowed file types: {configs.acceptedFiles}.</span>
                </div>
            </div>
        </>
    )
}

export default DropZoneComponent
