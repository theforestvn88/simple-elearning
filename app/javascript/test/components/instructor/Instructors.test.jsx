import React, { act } from "react"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import AppProvider from "../../../context/AppProvider"
import Instructors from "../../../components/instructor/Instructors"
import { RequireAuthorizedApiSpy, mockAuth } from "../../mocks/useAppContextMock"

const FakeInstructors = [
    {
        id: 1,
        name: 'Instructor1',
        rank: 'Professor'
    }
]

describe('Instructors', () => {
    beforeEach(() => {
        RequireAuthorizedApiSpy.mockImplementation(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(FakeInstructors) }))
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('Show Instructors List', async () => {
        mockAuth({token: 'xxx', user: { id: 1, name: 'User1', rank: 'administrator' }}, 'instructor', 'meta')

        await act( async () => render(<MemoryRouter><AppProvider subject='partner' identify='meta'><Instructors /></AppProvider></MemoryRouter>))

        expect(RequireAuthorizedApiSpy).toHaveBeenCalledWith(
            'GET', '/api/v1/instructors', {'partner_slug': 'meta'}
        )

        FakeInstructors.forEach((instructor) => {
            expect(screen.getByText(instructor.name)).toBeInTheDocument()
            expect(screen.getByText(instructor.rank)).toBeInTheDocument()
        })

        expect(screen.getByText('Add New Instructor')).toBeInTheDocument()
    })

    it('not allow normal instructor add new instructor', async () => {
        mockAuth({token: 'xxx', user: { id: 1, name: 'User1', rank: 'professor' }})

        await act( async () => render(<MemoryRouter><AppProvider subject='partner' identify='meta'><Instructors /></AppProvider></MemoryRouter>))

        expect(screen.queryByText('Add New Instructor')).not.toBeInTheDocument()
    })
})
