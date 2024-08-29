import React, { act } from 'react'
import { render, screen } from '@testing-library/react'
import { localStorageMockReturn } from '../mocks/localStorageMock'
import { fetchMockReturn } from '../mocks/fetchMock'
import App from '../../user/App'
import react_router from 'react-router-dom'
import { setupNavigateSpyOn } from '../jest.setup'

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
        const navigateSpy = setupNavigateSpyOn(react_router)

        localStorageMockReturn({token: 'xxx', token_expire_at: (new Date(Date.now() + 1000*60*60*10)).toUTCString()})
        fetchMockReturn([])

        await act( async () => render(<App />))

        expect(navigateSpy).toHaveBeenCalledWith('courses')
    })

    it('when token not null but expired then should navigate to login page', async () => {
        const navigateSpy = setupNavigateSpyOn(react_router)

        localStorageMockReturn({token: 'xxx', token_expire_at: (new Date(Date.now() - 1000*60)).toUTCString()})
        fetchMockReturn([])

        await act( async () => render(<App />))

        expect(navigateSpy).toHaveBeenCalledWith('/auth/login')
    })
})
