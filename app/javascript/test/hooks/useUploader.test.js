import { renderHook, act } from "@testing-library/react"
import * as RailsActiveStorage from "@rails/activestorage"
import { localStorageMockReturn } from "../mocks/localStorageMock"
import useUploader from "../../hooks/useUploader"
import flushPromises from "../helper/flushPromises"

jest.mock('@rails/activestorage', () => ({
    ...jest.requireActual('@rails/activestorage'),
    DirectUpload: jest.fn(),
}))

const DirectUploadSpy = jest.spyOn(RailsActiveStorage, 'DirectUpload')

const DirectUploadMockReturn = (blob) => DirectUploadSpy.mockImplementation(() => {
    return {
        create: jest.fn().mockImplementation((callback) => {
            callback(null, blob)
        })
    }
})

describe("useUploader", () => {
    it("direct upload", async () => {
        const fakeCache = {token: 'xxx', user: { id: 1, name: 'User1' }}
        localStorageMockReturn(fakeCache)

        const fakeSignedId = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        DirectUploadMockReturn({signed_id: fakeSignedId})

        const { result } = renderHook(() => useUploader())
        await act(async () => {
            const [ setSelectedFile, progress, blob ] = result.current
            await setSelectedFile(new File(['(⌐□_□)'], 'chucknorris.png', {type: 'image/png'}))
        })

        await flushPromises()
        expect(DirectUploadSpy).toHaveBeenCalled()
    })
})
