import React, { act } from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import react_router, { MemoryRouter } from 'react-router-dom'
import { fetchMock, fetchMockReturn, getSubmitBodyFromFetchMock } from '../../mocks/fetchMock'
import { localStorageMockReturn, localStorageSetItemSpy } from '../../mocks/localStorageMock'
import AppProvider from '../../../context/AppProvider'
import flushPromises from '../../helper/flushPromises'
import { fakeUser1 } from '../../mocks/fakeUsers'
import Profile from '../../../components/account/Profile'
import { mockUseUploader, directUploadFileSpy, fakeDirectUploadedBlobSignedId } from '../../mocks/useUploaderMock'

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
}))

describe('Profile', () => {
    beforeEach(() => {
        jest.spyOn(react_router, "useParams").mockReturnValue({ id: 1 })
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
        cleanup()
    })

    it('should show profile info', async () => {
        localStorageMockReturn({token: 'xxx', user: { id: 1, name: 'User1', avatar: { url: 'avatar-url' } }})
        fetchMockReturn(fakeUser1)

        await act( async () => render(<MemoryRouter><AppProvider subject='user' identify='*'><Profile /></AppProvider></MemoryRouter>))

        expect(fetchMock).toHaveBeenCalledWith(
            '/api/v1/users/1', 
            {"body": null, "headers": {"Content-Type": "application/json", "X-Auth-Token": "xxx"}, "method": "GET"}
        )
        
        expect(screen.getByText(fakeUser1.name)).toBeInTheDocument()
        expect(screen.getByText(fakeUser1.title)).toBeInTheDocument()
        expect(screen.getByText(fakeUser1.location)).toBeInTheDocument()
        expect(screen.getByRole('img', {src: 'avatar-url'})).toBeInTheDocument()

        fakeUser1.social_links.forEach((socialLink) => {
            expect(screen.getByText(socialLink.name)).toBeInTheDocument()
        })

        fakeUser1.skills.forEach((skill) => {
            expect(screen.getByText(skill.name)).toBeInTheDocument()
        })

        fakeUser1.certificates.forEach((cert) => {
            expect(screen.getByText(cert.name)).toBeInTheDocument()
        })
    })

    it('update profile', async () => {
        localStorageMockReturn({token: 'xxx', user: { id: 1, name: 'User1' }})
        fetchMockReturn({...fakeUser1, can_edit: true})

        await act( async () => render(<MemoryRouter><AppProvider subject='user' identify='*'><Profile /></AppProvider></MemoryRouter>))

        mockUseUploader()
        await act( async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile'}))
        })

        const fakeFile = new File(['(⌐□_□)'], 'chucknorris.png', {type: 'image/png'})
        await act( async () => {
            fireEvent.change(screen.getByDisplayValue(fakeUser1.name), {target: {value: 'updated-name'}})
            fireEvent.drop(document.querySelector('#avatar-dropzone'), {
                dataTransfer: {
                    files: [fakeFile],
                },
            })
        })
        
        expect(directUploadFileSpy).toHaveBeenCalledWith(fakeFile)
        
        const localStorageSpy = localStorageSetItemSpy()
        fetchMockReturn({ ...fakeUser1, id: 1, name: 'updated-name', avatar: { url: 'new-avatar-url' } })

        await act( async () => {
            fireEvent.submit(screen.getByTestId('update-profile-form'))
        })

        expect(fetchMock).toHaveBeenCalledWith(
            '/api/v1/users/1', 
            {
                "body": expect.any(FormData),
                "headers": {"X-Auth-Token": "xxx"}, 
                "method": "PUT"
            }
        )

        const formData = getSubmitBodyFromFetchMock(fetchMock)
        expect(formData['user[avatar]']).toEqual(fakeDirectUploadedBlobSignedId)
        expect(formData['user[name]']).toEqual('updated-name')

        // should save user updated avatar url to localstorage
        await flushPromises()
        expect(localStorageSpy).toHaveBeenCalled()
        expect(JSON.parse(localStorageSpy.mock.lastCall[1])['user']['avatar']['url']).toEqual('new-avatar-url')
        expect(JSON.parse(localStorageSpy.mock.lastCall[1])['user']['name']).toEqual('updated-name')
    })

    it('delete avatar', async () => {
        localStorageMockReturn({token: 'xxx', user: { id: 1, name: 'User1' }})
        fetchMockReturn({...fakeUser1, can_edit: true})

        await act( async () => render(<MemoryRouter><AppProvider subject='user' identify='*'><Profile /></AppProvider></MemoryRouter>))

        await act( async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Edit Profile'}))
        })

        await act( async () => {
            fireEvent.click(screen.getByText(/Remove file/i))
        })

        await act( async () => {
            fireEvent.submit(screen.getByTestId('update-profile-form'))
        })

        const formData = getSubmitBodyFromFetchMock(fetchMock)
    
        expect(formData['user[avatar]']).toEqual('')
    })

    it('delete account', async () => {
        localStorageMockReturn({token: 'xxx', user: { id: 1, name: 'User1' }})
        fetchMockReturn({...fakeUser1, can_delete: true})

        await act( async () => render(<MemoryRouter><AppProvider subject='user' identify='*'><Profile /></AppProvider></MemoryRouter>))

        fetchMock.mockRestore()

        await act( async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Delete Account'}))
        })

        await act( async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Confirm'}))
        })

        expect(fetchMock).toHaveBeenCalledWith(
            '/api/v1/users/1', 
            {
                "body": "{}",
                "headers": {"Content-Type": "application/json", "X-Auth-Token": "xxx"}, 
                "method": "DELETE"
            }
        )
    })
})
