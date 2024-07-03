import React, { act } from 'react'
import { render, screen } from '@testing-library/react'
import react_router, { MemoryRouter } from 'react-router-dom'
import { fetchMock, fetchMockReturn } from '../mocks/fetchMock'
import Profile from '../../components/Profile'
import { localStorageMockReturn } from '../mocks/localStorageMock'
import AppProvider from '../../context/AppProvider'

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
        social_links: "[{\"name\":\"Google\",\"link\":\"https://google.com\"},{\"name\":\"Facebook\",\"link\":\"https://facebook.com\"}]",
        skills: "[{\"name\":\"Frontend\",\"level\":8},{\"name\":\"Backend\",\"level\":5.5},{\"name\":\"Mobile\",\"level\":7.2}]",
        certificates: "[{\"name\":\"Senior Developer\",\"grade\":8.0}]"
    }

    beforeEach(() => {
        fetchMockReturn(fakeUser)
        jest.spyOn(react_router, "useParams").mockReturnValue({ id: 1 })
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('should show course info', async () => {
        localStorageMockReturn({token: 'xxx', user: { id: 1, name: 'User A' }})

        await act( async () => render(<MemoryRouter><AppProvider><Profile /></AppProvider></MemoryRouter>))

        expect(fetchMock).toHaveBeenCalledWith(
            '/api/v1/users/1', 
            {"body": null, "headers": {"Content-Type": "application/json", "X-Auth-Token": "xxx"}, "method": "GET"}
        )

        expect(screen.getByText(fakeUser.name)).toBeInTheDocument()
        expect(screen.getByText(fakeUser.title)).toBeInTheDocument()
        expect(screen.getByText(fakeUser.location)).toBeInTheDocument()

        JSON.parse(fakeUser.social_links).forEach((socialLink) => {
            expect(screen.getByText(socialLink.name)).toBeInTheDocument()
        })

        JSON.parse(fakeUser.skills).forEach((skill) => {
            expect(screen.getByText(skill.name)).toBeInTheDocument()
        })

        JSON.parse(fakeUser.certificates).forEach((cert) => {
            expect(screen.getByText(cert.name)).toBeInTheDocument()
        })
    })
})
