import React, { act } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import react_router, { MemoryRouter } from 'react-router-dom'
import AppProvider from '../../context/AppProvider'
import Nav from '../../components/Nav'
import flushPromises from '../helper/flushPromises'
import { mockAuth, logoutSpy } from '../mocks/useAuthMock'

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}))

const navigateSpy = jest.fn()
jest.spyOn(react_router, 'useNavigate').mockImplementation(() => navigateSpy)

describe('LogIn', () => {
    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('anynomous user', async () => {
        mockAuth({})

        await act( async () => render(<MemoryRouter><AppProvider><Nav /></AppProvider></MemoryRouter>))

        expect(screen.getByRole('link', { name: 'Log In', to: '/auth/login' })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'Sign Up', to: '/auth/signup' })).toBeInTheDocument()
    })

    it('authorized user', async () => {
        mockAuth({token: 'xxx', user: { name: 'User A' }})

        await act( async () => render(<MemoryRouter><AppProvider><Nav /></AppProvider></MemoryRouter>))

        expect(screen.getByRole('button', { name: 'Log Out'})).toBeInTheDocument()
        expect(screen.getByText('User A')).toBeInTheDocument()
    })
    
    it('logout user with valid token', async () => {
        mockAuth({token: 'xxx'})

        await act( async () => render(<MemoryRouter><AppProvider><Nav /></AppProvider></MemoryRouter>))

        await act( async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Log Out'}))
        })

        expect(logoutSpy).toHaveBeenCalled()
    })

    it('logout user with expired token', async () => {
        mockAuth({token: 'xxx'})

        await act( async () => render(<MemoryRouter><AppProvider><Nav /></AppProvider></MemoryRouter>))

        logoutSpy.mockImplementation(() => Promise.resolve({ ok: false, status: 401, json: () => Promise.resolve({}) }))
        await act( async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Log Out'}))
        })

        await flushPromises()
        
        // should navigate to home page
        expect(navigateSpy).toHaveBeenCalledWith('/courses')
    })
})