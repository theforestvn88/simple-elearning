import React, { act } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { fetchMock, fetchMockReturn } from '../../mocks/fetchMock'
import LogIn from '../../../components/auth/LogIn'
import AppProvider from '../../../context/AppProvider'

describe('LogIn', () => {
    beforeEach(() => {
        fetchMockReturn({token: "xxx"})
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('call login api', async () => {
        await act( async () => render(<MemoryRouter><AppProvider><LogIn /></AppProvider></MemoryRouter>))

        fireEvent.change(screen.getByLabelText(/Email/i), {target: {value: 'tester@example.com'}})
        fireEvent.change(screen.getByLabelText(/Password/i), {target: {value: '1111111111'}})

        fireEvent.click(screen.getByDisplayValue('Log In'))

        expect(fetchMock).toHaveBeenCalledWith(
            '/api/auth/login', 
            {"body": "{\"email\":\"tester@example.com\",\"password\":\"1111111111\"}", "headers": {"Content-Type": "application/json"}, "method": "POST"}
        )
    })
})
