import React, { act } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import react_router, { MemoryRouter } from 'react-router-dom'
import { fetchMock, fetchMockReturn, getSubmitBodyFromFetchMock } from '../mocks/fetchMock'
import Profile from '../../components/Profile'
import { localStorageMockReturn, localStorageSetItemSpy } from '../mocks/localStorageMock'
import AppProvider from '../../context/AppProvider'
import { upload } from '@testing-library/user-event/dist/cjs/utility/upload.js'
import flushPromises from '../helper/flushPromises'

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
}))

describe('Profile', () => {
    const fakeUser = {
        id: 1,
        name: 'Tester',
        title: 'Full Stack Developer',
        location: 'Mars',
        avatar: {
            name: '',
            byte_size: 0,
            url: ''
        },
        social_links: [{name: "Google", link: "https://google.com"},{name: "Facebook", link: "https://facebook.com"}],
        skills: [{name: "Frontend", level: 8}, {name: "Backend", level: 5.5}, {name: "Mobile", level: 7.2}],
        certificates: [{name: "Senior Developer", grade: 8.0}]
    }

    beforeEach(() => {
        jest.spyOn(react_router, "useParams").mockReturnValue({ id: 1 })
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('should show profile info', async () => {
        localStorageMockReturn({token: 'xxx', user: { id: 1, name: 'User A' }})
        fetchMockReturn(fakeUser)

        await act( async () => render(<MemoryRouter><AppProvider><Profile /></AppProvider></MemoryRouter>))

        expect(fetchMock).toHaveBeenCalledWith(
            '/api/v1/users/1', 
            {"body": null, "headers": {"Content-Type": "application/json", "X-Auth-Token": "xxx"}, "method": "GET"}
        )

        expect(screen.getByText(fakeUser.name)).toBeInTheDocument()
        expect(screen.getByText(fakeUser.title)).toBeInTheDocument()
        expect(screen.getByText(fakeUser.location)).toBeInTheDocument()

        fakeUser.social_links.forEach((socialLink) => {
            expect(screen.getByText(socialLink.name)).toBeInTheDocument()
        })

        fakeUser.skills.forEach((skill) => {
            expect(screen.getByText(skill.name)).toBeInTheDocument()
        })

        fakeUser.certificates.forEach((cert) => {
            expect(screen.getByText(cert.name)).toBeInTheDocument()
        })
    })

    it('update profile', async () => {
        localStorageMockReturn({token: 'xxx', user: { id: 1, name: 'User A' }})
        fetchMockReturn({...fakeUser, can_edit: true})

        await act( async () => render(<MemoryRouter><AppProvider><Profile /></AppProvider></MemoryRouter>))

        fetchMock.mockRestore()
        fetchMockReturn({...fakeUser, name: 'updated-name'})
        const spy = localStorageSetItemSpy()

        fireEvent.click(screen.getByRole('button', { name: 'Edit Profile'}))

        fireEvent.change(screen.getByDisplayValue(fakeUser.name), {target: {value: 'updated-name'}})

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
        localStorageMockReturn({token: 'xxx', user: { id: 1, name: 'User A' }})
        fetchMockReturn({...fakeUser, can_edit: true})

        await act( async () => render(<MemoryRouter><AppProvider><Profile /></AppProvider></MemoryRouter>))

        fetchMock.mockRestore()

        fireEvent.click(screen.getByRole('button', { name: 'Edit Profile'}))

        fireEvent.drop(document.querySelector('#avatar-dropzone'), {
            dataTransfer: {
              files: [new File(['(⌐□_□)'], 'chucknorris.png', {type: 'image/png'})],
            },
        })

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
    
        expect(formData['user[avatar]']['upload']['filename']).toEqual('chucknorris.png')
    })

    it('delete account', async () => {
        localStorageMockReturn({token: 'xxx', user: { id: 1, name: 'User A' }})
        fetchMockReturn({...fakeUser, can_delete: true})

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
