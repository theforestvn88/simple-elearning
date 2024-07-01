import React, { act } from 'react'
import { render, screen } from '@testing-library/react'
import react_router from 'react-router-dom'
import App from '../../components/App'
import { localStorageMockReturn } from '../mocks/localStorageMock'
import { fetchMock, fetchMockReturn } from '../mocks/fetchMock'

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Navigate: jest.fn(),
}));

describe('App', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('when token null then should show intro page', () => {
        localStorageMockReturn({})

        render(<App />)

        expect(screen.getByRole('link', { to: '/courses' })).toBeInTheDocument()
    })

    it('when token not null and not expired then should navigate to courses page', async () => {
        jest.spyOn(react_router, 'Navigate').mockImplementation((props) => <h1>{props.to}</h1>)

        localStorageMockReturn({token: 'xxx', token_expire_at: (new Date(Date.now() + 1000*60*60*10)).toUTCString()})
        fetchMockReturn([])

        await act( async () => render(<App />))

        expect(screen.getByText('/courses')).toBeInTheDocument()
    })

    it('when token not null but expired then should navigate to login page', async () => {
        jest.spyOn(react_router, 'Navigate').mockImplementation((props) => <h1>{props.to}</h1>)

        localStorageMockReturn({token: 'xxx', token_expire_at: (new Date(Date.now() - 1000*60)).toUTCString()})
        fetchMockReturn([])

        await act( async () => render(<App />))

        expect(screen.getByText('/auth/login')).toBeInTheDocument()
    })

    it('slient refresh will-expired-token', async () => {
        localStorageMockReturn({token: 'xxx', token_expire_at: (new Date(Date.now() + 1000*60*60)).toUTCString()})

        await act( async () => render(<App />))

        expect(fetchMock).toHaveBeenCalledWith('/api/auth/refresh_token', {
            "method": "POST",
            "headers": {"Content-Type": "application/json", "X-Auth-Token": "xxx"},
        })
    })

    it('no need to refresh long-life-token', async () => {
        localStorageMockReturn({token: 'xxx', token_expire_at: (new Date(Date.now() + 1000*60*60*3)).toUTCString()})

        await act( async () => render(<App />))

        expect(fetchMock).not.toHaveBeenCalledWith('/api/auth/refresh_token', {
            "method": "POST",
            "headers": {"Content-Type": "application/json", "X-Auth-Token": "xxx"},
        })
    })
})
