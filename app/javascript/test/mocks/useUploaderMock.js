export const directUploadFileSpy = jest.fn()
export const fakeDirectUploadedBlobSignedId = "abcxyz123456789"

export const mockUseUploader = () => {
    console.log("mockUseUploader")
    
    jest.spyOn(require('../../hooks/useUploader'), 'default').mockReturnValue([
        directUploadFileSpy, 0, {signed_id: fakeDirectUploadedBlobSignedId}
    ])
}


export const RailsActiveStorageDirectUploadSpy = jest.spyOn(require('@rails/activestorage'), 'DirectUpload')

export const DirectUploadMockReturn = (blob) => RailsActiveStorageDirectUploadSpy.mockImplementation(() => {
    return {
        create: jest.fn().mockImplementation((callback) => {
            callback(null, blob)
        })
    }
})
