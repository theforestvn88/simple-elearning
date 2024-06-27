import React, { act } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { fetchMock, fetchMockReturn, fetchMockError } from '../mocks/fetchMock'
import AppProvider from '../../context/AppProvider'
import Nav from '../../components/Nav'
import { localStorageMockReturn, localStorageRemoveItemSpy } from '../mocks/localStorageMock'
import flushPromises from '../helper/flushPromises'

describe('LogIn', () => {
    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('anynomous user', async () => {
        localStorageMockReturn({})

        await act( async () => render(<MemoryRouter><AppProvider><Nav /></AppProvider></MemoryRouter>))

        expect(screen.getByRole('link', { name: 'Log In', to: '/auth/login' })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'Sign Up', to: '/auth/signup' })).toBeInTheDocument()
    })

    it('authorized user', async () => {
        localStorageMockReturn({token: 'xxx'})

        await act( async () => render(<MemoryRouter><AppProvider><Nav /></AppProvider></MemoryRouter>))

        expect(screen.getByRole('button', { name: 'Log Out'})).toBeInTheDocument()
    })
    
    it('logout user with valid token', async () => {
        fetchMockReturn({message: 'logout success'})
        localStorageMockReturn({token: 'xxx'})

        await act( async () => render(<MemoryRouter><AppProvider><Nav /></AppProvider></MemoryRouter>))

        fireEvent.click(screen.getByRole('button', { name: 'Log Out'}))

        expect(fetchMock).toHaveBeenCalledWith(
            '/api/auth/logout',
            {
                "headers": {"Content-Type": "application/json", "X-Auth-Token": "xxx"}, 
                "method": "DELETE"
            }
        )
    })

    it('logout user with expired token', async () => {
        const spy = localStorageRemoveItemSpy()
        fetchMockError(401, {message: 'unauthrorized'})
        localStorageMockReturn({token: 'xxx'})

        await act( async () => render(<MemoryRouter><AppProvider><Nav /></AppProvider></MemoryRouter>))

        fireEvent.click(screen.getByRole('button', { name: 'Log Out'}))

        await flushPromises()
        
        expect(spy).toHaveBeenCalled()
    })
})