import React from "react"
import { localStorageMockReturn } from "../mocks/localStorageMock"
import { act, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import AppProvider from "../../context/AppProvider"
import PartnerDashBoard from "../../components/PartnerDashboard"

describe('PartnerDashboard', () => {
    beforeEach(() => {

    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('show partner-settings tab if current user is admin', async () => {
        localStorageMockReturn({token: 'xxx', user: {id: 1, rank: 'administrator'}})

        await act( async () => render(<MemoryRouter><AppProvider subject='partner' identify='partner-1'><PartnerDashBoard /></AppProvider></MemoryRouter>))

        expect(screen.getByText('Partner Settings')).toBeInTheDocument()
    })

    it('do not show partner-settings tab if current user is not an admin', async () => {
        localStorageMockReturn({token: 'xxx', user: {id: 1, rank: 'lecturer'}})

        await act( async () => render(<MemoryRouter><AppProvider subject='partner' identify='partner-1'><PartnerDashBoard /></AppProvider></MemoryRouter>))

        expect(screen.queryByText('Partner Settings')).not.toBeInTheDocument()
    })
})
