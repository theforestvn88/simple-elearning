import React from 'react'
import { fireEvent, render, screen, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AppProvider from '../../../context/AppProvider'
import SignUp from '../../../components/auth/SignUp'
import { signupSpy } from '../../mocks/useAppContextMock'

describe('LogIn', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('call signup api', async () => {
        await act( async () => render(<MemoryRouter><AppProvider><SignUp /></AppProvider></MemoryRouter>))

        await act( async () => {
            fireEvent.change(screen.getByLabelText(/Email/i), {target: {value: 'tester@example.com'}})
            fireEvent.change(screen.getByLabelText(/Name/i), {target: {value: 'tester'}})
            fireEvent.change(screen.getByLabelText(/^Password$/i), {target: {value: '1111111111'}})
            fireEvent.change(screen.getByLabelText(/Password Confirmation/i), {target: {value: '1111111111'}})

            fireEvent.click(screen.getByDisplayValue('Sign Up'))
        })

        expect(signupSpy).toHaveBeenCalledWith({
            'email': 'tester@example.com',
            'name': 'tester',
            'password': '1111111111',
            'password_confirmation': '1111111111'
        })
    })
})
