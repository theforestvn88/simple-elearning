import React, { act } from 'react'
import { render, screen } from '@testing-library/react'
import react_router, { MemoryRouter } from 'react-router-dom'
import { localStorageMockReturn } from '../mocks/localStorageMock'
import { fetchMock, fetchMockReturn } from '../mocks/fetchMock'
import AppProvider from '../../context/AppProvider'
import Partner from '../../components/Partner'

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Navigate: jest.fn(),
}));

describe('Partner', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('when token null then should navigate to login page', async () => {
        jest.spyOn(react_router, 'Navigate').mockImplementation((props) => <h1>{props.to}</h1>)

        localStorageMockReturn({})
        fetchMockReturn([])

        await act( async () => render(<MemoryRouter><AppProvider subject='instructor' identify='meta'><Partner /></AppProvider></MemoryRouter>))

        expect(screen.getByText('auth/login')).toBeInTheDocument()
    })

    it('when token expired then should navigate to login page', async () => {
        jest.spyOn(react_router, 'Navigate').mockImplementation((props) => <h1>{props.to}</h1>)

        localStorageMockReturn({token: 'xxx', token_expire_at: (new Date(Date.now() - 1000*60)).toUTCString()})
        fetchMockReturn([])

        await act( async () => render(<MemoryRouter><AppProvider subject='instructor' identify='meta'><Partner /></AppProvider></MemoryRouter>))

        expect(screen.getByText('auth/login')).toBeInTheDocument()
    })

    it('slient refresh will-expired-token', async () => {
        localStorageMockReturn({token: 'xxx', token_expire_at: (new Date(Date.now() + 1000*60*60)).toUTCString()})

        await act( async () => render(<MemoryRouter><AppProvider subject='instructor' identify='meta'><Partner /></AppProvider></MemoryRouter>))

        expect(fetchMock).toHaveBeenCalledWith('/api/auth/instructor/meta/refresh_token', {
            "method": "POST",
            "headers": {"Content-Type": "application/json", "X-Auth-Token": "xxx"},
            "body": "{}"
        })
    })

    it('no need to refresh long-life-token', async () => {
        localStorageMockReturn({token: 'xxx', token_expire_at: (new Date(Date.now() + 1000*60*60*3)).toUTCString()})

        await act( async () => render(<MemoryRouter><AppProvider subject='instructor' identify='meta'><Partner /></AppProvider></MemoryRouter>))

        expect(fetchMock).not.toHaveBeenCalledWith('/api/auth/instructor/meta/refresh_token', {
            "method": "POST",
            "headers": {"Content-Type": "application/json", "X-Auth-Token": "xxx"},
            "body": "{}"
        })
    })
})
