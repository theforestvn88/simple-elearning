import React, { act } from "react"
import { fetchMock, fetchMockReturn, getSubmitBodyFromFetchMock } from "../mocks/fetchMock"
import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import AppProvider from "../../context/AppProvider"
import PartnerSettings from "../../components/PartnerSettings"
import { localStorageMockReturn } from "../mocks/localStorageMock"

describe('PartnerSettings', () => {
    const fakePartner = {name: 'partner 1', can_edit: true}

    beforeEach(async () => {
        localStorageMockReturn({token: 'xxx', user: {id: 1, rank: 'administrator'}})
        fetchMockReturn(fakePartner)
        await act( async () => render(<MemoryRouter><AppProvider subject='partner' identify='partner-1'><PartnerSettings /></AppProvider></MemoryRouter>))
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('should show partner info', async () => {
        expect(fetchMock).toHaveBeenCalledWith(
            '/api/v1/partner/partner-1/', 
            {"body": null, "headers": {"Content-Type": "application/json", "X-Auth-Token": "xxx"}, "method": "GET"}
        )

        expect(screen.getByText(fakePartner.name)).toBeInTheDocument()
    })

    it('update', async () => {
        await act(async() => {
            fireEvent.click(screen.getByRole('button', {name: 'Edit'}))
        })

        await act(async() => {
            fireEvent.change(screen.getByLabelText('Name'), {target: {value: 'updated-name'}})
            fireEvent.submit(screen.getByTestId('update-partner-form'))
        })

        expect(fetchMock).toHaveBeenCalledWith(
            '/api/v1/partner/partner-1/update', 
            {
                "body": expect.any(FormData),
                "headers": {"X-Auth-Token": "xxx"}, 
                "method": "PUT"
            }
        )

        const submitedData = getSubmitBodyFromFetchMock(fetchMock)
        expect(submitedData['partner[name]']).toEqual('updated-name')
    })
})
