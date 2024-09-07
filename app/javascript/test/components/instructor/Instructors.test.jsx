import React, { act } from "react"
import { render, screen } from "@testing-library/react"
import { fetchMock, fetchMockReturn } from "../../mocks/fetchMock"
import { MemoryRouter } from "react-router-dom"
import AppProvider from "../../../context/AppProvider"
import Instructors from "../../../components/instructor/Instructors"

const FakeInstructors = [
    {
        id: 1,
        name: 'Instructor1',
        rank: 'Professor'
    }
]

describe('Instructors', () => {
    beforeEach(() => {
        fetchMockReturn(FakeInstructors)
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('Show Instructors List', async () => {
        await act( async () => render(<MemoryRouter><AppProvider subject='instructor' identify='meta'><Instructors /></AppProvider></MemoryRouter>))

        expect(fetchMock).toHaveBeenCalledWith(
            '/api/v1/instructors?partner_slug=meta', 
            {"body": null, "headers": {"Content-Type": "application/json"}, "method": "GET"}
        )

        FakeInstructors.forEach((instructor) => {
            expect(screen.getByText(instructor.name)).toBeInTheDocument()
            expect(screen.getByText(instructor.rank)).toBeInTheDocument()
        })
    })
})
