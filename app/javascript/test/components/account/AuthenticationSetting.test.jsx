import React, { act } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import react_router, { MemoryRouter } from 'react-router-dom'
import { fetchMock, fetchMockReturn } from '../../mocks/fetchMock'
import { localStorageMockReturn, localStorageRemoveItemSpy } from '../../mocks/localStorageMock'
import AppProvider from '../../../context/AppProvider'
import flushPromises from '../../helper/flushPromises'
import AuthenticationSetting from '../../../components/account/AuthenticationSetting'

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
        const clearAuthSpy = localStorageRemoveItemSpy()
        localStorageMockReturn({token: 'xxx', user: { id: 1, name: 'User1' }})
        fetchMockReturn({})

        await act( async () => render(<MemoryRouter><AppProvider><AuthenticationSetting /></AppProvider></MemoryRouter>))

        fireEvent.click(screen.getByRole('button', { name: 'Change Password'}))
        fireEvent.change(screen.getByLabelText(/^Old Password$/i), {target: {value: 'old-password'}})
        fireEvent.change(screen.getByLabelText(/^New Password$/i), {target: {value: 'new-password'}})
        fireEvent.change(screen.getByLabelText(/New Password Confirmation/i), {target: {value: 'new-password'}})

        fireEvent.submit(screen.getByDisplayValue('Update'))

        expect(fetchMock).toHaveBeenCalledWith(
            '/api/auth/password/update', 
            {
                "body": "{\"password_challenge\":\"old-password\",\"password\":\"new-password\",\"password_confirmation\":\"new-password\"}",
                "headers": {"Content-Type": "application/json", "X-Auth-Token": "xxx"}, 
                "method": "PUT"
            }
        )

        await flushPromises()
        
        // should clear auth
        expect(clearAuthSpy).toHaveBeenCalled()

        // should navigate to login page
        expect(navigateSpy).toHaveBeenCalledWith('/auth/login')
    })
})
