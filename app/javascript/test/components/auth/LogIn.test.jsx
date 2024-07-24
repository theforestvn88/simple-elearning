import React from 'react'
import { fireEvent, render, screen, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AppProvider from '../../../context/AppProvider'
import LogIn from '../../../components/auth/LogIn'
import { loginSpy } from '../../mocks/useAuthMock'

describe('LogIn', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('call login api', async () => {
        await act( async () => {
            render(<MemoryRouter><AppProvider><LogIn /></AppProvider></MemoryRouter>)
        })

        await act(async () => {
            fireEvent.change(screen.getByLabelText(/Email/i), {target: {value: 'tester@example.com'}})
            fireEvent.change(screen.getByLabelText(/Password/i), {target: {value: '1111111111'}})
    
            fireEvent.click(screen.getByDisplayValue('Log In'))
        })

        expect(loginSpy).toHaveBeenCalledWith({
            'email': 'tester@example.com',
            'password': '1111111111',
        })
    })
})
