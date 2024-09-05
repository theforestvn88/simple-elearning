import React, { act } from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { localStorageMockReturn } from '../mocks/localStorageMock'
import { fetchMock, fetchMockReturn } from '../mocks/fetchMock'
import AppProvider from '../../context/AppProvider'
import Partner from '../../components/Partner'
import { verifyThatLoginPageWithoutSignUpOnScreen } from '../helper/verification'

describe('Partner', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('when token null then should show login page', async () => {
        localStorageMockReturn({})
        fetchMockReturn([])

        await act( async () => render(<MemoryRouter><AppProvider subject='instructor' identify='meta'><Partner /></AppProvider></MemoryRouter>))

        verifyThatLoginPageWithoutSignUpOnScreen(screen)
    })

    it('when token expired then should show login page', async () => {
        localStorageMockReturn({token: 'xxx', token_expire_at: (new Date(Date.now() - 1000*60)).toUTCString()})
        fetchMockReturn([])

        await act( async () => render(<MemoryRouter><AppProvider subject='instructor' identify='meta'><Partner /></AppProvider></MemoryRouter>))

        verifyThatLoginPageWithoutSignUpOnScreen(screen)
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
