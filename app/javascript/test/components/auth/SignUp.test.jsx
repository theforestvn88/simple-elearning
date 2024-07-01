import React, { act } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { fetchMock, fetchMockReturn } from '../../mocks/fetchMock'
import AppProvider from '../../../context/AppProvider'
import SignUp from '../../../components/auth/SignUp'

describe('LogIn', () => {
    beforeEach(() => {
        fetchMockReturn({token: "xxx"})
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('call login api', async () => {
        await act( async () => render(<MemoryRouter><AppProvider><SignUp /></AppProvider></MemoryRouter>))

        fireEvent.change(screen.getByLabelText(/Email/i), {target: {value: 'tester@example.com'}})
        fireEvent.change(screen.getByLabelText(/Name/i), {target: {value: 'tester'}})
        fireEvent.change(screen.getByLabelText(/^Password$/i), {target: {value: '1111111111'}})
        fireEvent.change(screen.getByLabelText(/Password Confirmation/i), {target: {value: '1111111111'}})

        fireEvent.click(screen.getByDisplayValue('Sign Up'))

        expect(fetchMock).toHaveBeenCalledWith(
            '/api/auth/signup', 
            {
                "body": "{\"email\":\"tester@example.com\",\"password\":\"1111111111\",\"password_confirmation\":\"1111111111\",\"name\":\"tester\"}",
                "headers": {"Content-Type": "application/json"}, 
                "method": "POST"
            }
        )
    })
})
