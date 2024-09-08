import React from 'react'
import { fireEvent, render, screen, act } from '@testing-library/react'
import react_router, { MemoryRouter } from 'react-router-dom'
import AppProvider from '../../../context/AppProvider'
import AuthenticationSetting from '../../../components/account/AuthenticationSetting'
import { changePasswordSpy } from '../../mocks/useAppContextMock'

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}))

const navigateSpy = jest.fn()
jest.spyOn(react_router, 'useNavigate').mockImplementation(() => navigateSpy)

describe('AuthenticationSetting', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('allow user change his password', async () => {
        await act( async () => render(<MemoryRouter><AppProvider><AuthenticationSetting /></AppProvider></MemoryRouter>))

        await act( async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Change Password'}))
        })

        await act( async () => {
            fireEvent.change(screen.getByLabelText(/^Old Password$/i), {target: {value: 'old-password'}})
            fireEvent.change(screen.getByLabelText(/^New Password$/i), {target: {value: 'new-password'}})
            fireEvent.change(screen.getByLabelText(/New Password Confirmation/i), {target: {value: 'new-password'}})

            fireEvent.submit(screen.getByDisplayValue('Update'))
        })

        expect(changePasswordSpy).toHaveBeenCalledWith({
            'password_challenge': 'old-password',
            'password': 'new-password',
            'password_confirmation': 'new-password'
        })

        // should navigate to login page
        expect(navigateSpy).toHaveBeenCalledWith('/auth/login')
    })
})
