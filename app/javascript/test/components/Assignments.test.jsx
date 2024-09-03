import React, { act } from 'react'
import { fireEvent, render, screen, cleanup } from '@testing-library/react'
import { fetchMock, fetchMockReturn } from '../mocks/fetchMock'
import Assignments from '../../components/Assignments'
import { MemoryRouter } from 'react-router-dom'
import AppProvider from '../../context/AppProvider'
import { PaginationTests } from '../common/PaginationTests'

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
        fetchMockReturn({assignments: fakeAssignments, pagination: FakePagination })
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })
    
    it('show assignments list', async () => {
        await act( async () => render(<MemoryRouter><AppProvider subject='instructor' identify='meta'><Assignments /></AppProvider></MemoryRouter>))

        expect(fetchMock).toHaveBeenCalledWith(
            '/api/v1/instructor/meta/assignments?page=1', 
            {"body": null, "headers": {"Content-Type": "application/json"}, "method": "GET"}
        )

        fakeAssignments.forEach((assignment) => {
            expect(screen.getByRole('link', {to: assignment.assignable_path})).toBeInTheDocument()
            expect(screen.getByText(assignment.created_time)).toBeInTheDocument()
        })
    })

    PaginationTests(<MemoryRouter><AppProvider subject='instructor' identify='meta'><Assignments /></AppProvider></MemoryRouter>, '/assignments')
})
