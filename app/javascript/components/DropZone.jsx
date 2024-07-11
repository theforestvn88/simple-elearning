import React, { useEffect, useRef, useState } from "react"
import Dropzone from "dropzone"

Dropzone.autoDiscover = false

const DropZoneComponent = ({configs, init, addFileSuccess, removeFileSuccess, existedFiles, className, ...others}) => {
    const dropzoneRef = useRef(null)
    const [thisDropZone, setThisDropZone] = useState(null)
    const [upload, setUpload] = useState(false)

    const showPreview = (file) => {
        if(!thisDropZone || !file) return

        let mockFile = {
          name: file.name,
          size: file.byte_size,
          dataURL: file.url,
          accepted: true
        }

        thisDropZone.files.push(mockFile)
        thisDropZone.emit("addedfile", mockFile)
        thisDropZone.createThumbnailFromUrl(
          mockFile,
          thisDropZone.options.thumbnailWidth,
          thisDropZone.options.thumbnailHeight,
          thisDropZone.options.thumbnailMethod,
          true,
          thumbnail => {
            thisDropZone.emit('thumbnail', mockFile, thumbnail);
            thisDropZone.emit("complete", mockFile);
          }
        )
    }

    // create dropzone
    useEffect(() => {
        if (configs.upload) {
            setUpload(true)
        } else {
            setUpload(false)
            configs.url = 'no-upload'
        }

        setThisDropZone(new Dropzone(dropzoneRef.current, configs))
    }, [dropzoneRef])

    // setup dropzone after it created
    useEffect(() => {
        if (!thisDropZone) return

        if (typeof(init) === 'function') {
            init(thisDropZone)
        }

        if (existedFiles) {
            existedFiles.forEach(file => showPreview(file))
        }
        
        thisDropZone.on('addedfile', (file) => {
            if (configs.autoHandleWhenMaxFilesExceeded) {
                const currAcceptedFiles = thisDropZone.getAcceptedFiles()
                if(currAcceptedFiles.length >= configs.maxFiles) {
                    let firstFile = currAcceptedFiles[0]
                    thisDropZone.removeFile(firstFile)
                }
            }

            if (typeof(addFileSuccess) === 'function') {
                addFileSuccess(file)
            }

            if (!upload) { // force complete if in not-upload mode
                thisDropZone.emit("complete", file)
            }
        })

        thisDropZone.on('removedfile', removeFileSuccess)
    }, [thisDropZone])

    return (
        <>
            <div className={`dropzone ${className}`} ref={dropzoneRef} {...others}></div>
        </>
    )
}

export default DropZoneComponent
