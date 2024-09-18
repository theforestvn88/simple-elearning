import React, { act } from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AppProvider from '../../context/AppProvider'
import { PaginationTests } from '../common/PaginationTests'
import Assignments from '../../components/assignment/Assignments'
import { RequireAuthorizedApiSpy, MockApiReturn, mockAuth } from '../mocks/useAppContextMock'

describe('Assignments', () => {
    const fakeAssignments = [
        {
            id: 1,
            assignable_type: 'Course',
            assignable_id: 1,
            assignable_name: 'React Tutorial',
            assignable_path: '/courses/1',
            created_time: '1 day',
            updated_time: 'less than a minute'
        }
    ]
    const FakePagination = { pages: ['1', '2', 'gap', '3', '4'], total: 10 }

    beforeEach(() => {
        mockAuth({token: 'xxx', user: { name: 'Instructor 1' }})
        MockApiReturn({assignments: fakeAssignments, pagination: FakePagination })
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })
    
    it('show assignments list', async () => {
        await act( async () => render(<MemoryRouter><AppProvider subject='partner' identify='meta'><Assignments /></AppProvider></MemoryRouter>))

        expect(RequireAuthorizedApiSpy).toHaveBeenCalledWith(
            "GET", "/api/v1/subject/identify/assignments", {"page": 1}
        )

        fakeAssignments.forEach((assignment) => {
            expect(screen.getByRole('link', {to: assignment.assignable_path})).toBeInTheDocument()
            expect(screen.getByText(assignment.created_time)).toBeInTheDocument()
        })
    })

    PaginationTests(<MemoryRouter><AppProvider subject='partner' identify='meta'><Assignments /></AppProvider></MemoryRouter>, 'subject/identify/assignments')
})
