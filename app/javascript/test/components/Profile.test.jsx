import React, { act } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import react_router, { MemoryRouter } from 'react-router-dom'
import { fetchMock, fetchMockReturn, getSubmitBodyFromFetchMock } from '../mocks/fetchMock'
import Profile from '../../components/Profile'
import { localStorageMockReturn, localStorageSetItemSpy } from '../mocks/localStorageMock'
import AppProvider from '../../context/AppProvider'
import flushPromises from '../helper/flushPromises'
import * as RailsActiveStorage from "@rails/activestorage"
import { fakeUser1 } from '../mocks/fakeUsers'

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
    })

    it('should show profile info', async () => {
        localStorageMockReturn({token: 'xxx', user: { id: 1, name: 'User1', avatar: { url: 'avatar-url' } }})
        fetchMockReturn(fakeUser1)

        await act( async () => render(<MemoryRouter><AppProvider><Profile /></AppProvider></MemoryRouter>))

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

        await act( async () => render(<MemoryRouter><AppProvider><Profile /></AppProvider></MemoryRouter>))

        fetchMock.mockRestore()
        fetchMockReturn({...fakeUser1, name: 'updated-name'})
        const spy = localStorageSetItemSpy()

        fireEvent.click(screen.getByRole('button', { name: 'Edit Profile'}))

        fireEvent.change(screen.getByDisplayValue(fakeUser1.name), {target: {value: 'updated-name'}})

        fireEvent.submit(screen.getByTestId('update-profile-form'))
        
        expect(fetchMock).toHaveBeenCalledWith(
            '/api/v1/users/1', 
            {
                "body": expect.any(FormData),
                "headers": {"X-Auth-Token": "xxx"}, 
                "method": "PUT"
            }
        )

        const formData = getSubmitBodyFromFetchMock(fetchMock)
        expect(formData).toMatchObject({ 'user[name]': 'updated-name' })

        // should save user updated info to localstorage
        await flushPromises()
        expect(spy).toHaveBeenCalled()
        expect(JSON.parse(spy.mock.lastCall[1])['user']['name']).toEqual('updated-name')
    })

    it('update avatar', async () => {
        localStorageMockReturn({token: 'xxx', user: { id: 1, name: 'User1' }})
        fetchMockReturn({...fakeUser1, can_edit: true})

        await act( async () => render(<MemoryRouter><AppProvider><Profile /></AppProvider></MemoryRouter>))

        const fakeSignedId = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        DirectUploadMockReturn({signed_id: fakeSignedId})

        fireEvent.click(screen.getByRole('button', { name: 'Edit Profile'}))

        fireEvent.drop(document.querySelector('#avatar-dropzone'), {
            dataTransfer: {
              files: [new File(['(⌐□_□)'], 'chucknorris.png', {type: 'image/png'})],
            },
        })

        await flushPromises()
        expect(DirectUploadSpy).toHaveBeenCalled()

        fetchMock.mockRestore()
        fetchMockReturn({...fakeUser1, avatar: { url: 'avatar-url' } })

        const spy = localStorageSetItemSpy()

        fireEvent.submit(screen.getByTestId('update-profile-form'))

        expect(fetchMock).toHaveBeenCalledWith(
            '/api/v1/users/1', 
            {
                "body": expect.any(FormData),
                "headers": {"X-Auth-Token": "xxx"}, 
                "method": "PUT"
            }
        )

        const formData = getSubmitBodyFromFetchMock(fetchMock)
    
        expect(formData['user[avatar]']).toEqual(fakeSignedId)

        // should save user updated avatar url to localstorage
        await flushPromises()
        expect(spy).toHaveBeenCalled()
        expect(JSON.parse(spy.mock.lastCall[1])['user']['avatar']['url']).toEqual('avatar-url')
    })

    it('delete avatar', async () => {
        localStorageMockReturn({token: 'xxx', user: { id: 1, name: 'User1' }})
        fetchMockReturn({...fakeUser1, can_edit: true})

        await act( async () => render(<MemoryRouter><AppProvider><Profile /></AppProvider></MemoryRouter>))

        fireEvent.click(screen.getByRole('button', { name: 'Edit Profile'}))

        fireEvent.click(screen.getByText(/Remove file/i))

        fireEvent.submit(screen.getByTestId('update-profile-form'))

        const formData = getSubmitBodyFromFetchMock(fetchMock)
    
        expect(formData['user[avatar]']).toEqual('')
    })

    it('delete account', async () => {
        localStorageMockReturn({token: 'xxx', user: { id: 1, name: 'User1' }})
        fetchMockReturn({...fakeUser1, can_delete: true})

        await act( async () => render(<MemoryRouter><AppProvider><Profile /></AppProvider></MemoryRouter>))

        fetchMock.mockRestore()

        fireEvent.click(screen.getByRole('button', { name: 'Delete Account'}))
        fireEvent.click(screen.getByRole('button', { name: 'Confirm'}))

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
