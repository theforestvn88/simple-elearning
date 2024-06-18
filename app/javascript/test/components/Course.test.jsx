import React, { act } from 'react'
import { render, screen } from '@testing-library/react'
import react_router, { MemoryRouter } from 'react-router-dom'
import Course from '../../components/Course'
import { fetchMock, fetchMockReturn } from '../mocks/fetchMock'
import { fakeCourses } from '../mocks/fakeCourses'

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
}))

describe('Course', () => {
    beforeEach(() => {
        fetchMockReturn(fakeCourses[0])
        jest.spyOn(react_router, "useParams").mockReturnValue({ id: 1 })
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('should show course info', async () => {
        await act( async () => render(<MemoryRouter><Course /></MemoryRouter>))

        expect(fetchMock).toHaveBeenCalledWith('/api/v1/courses/1')

        expect(screen.getByText(fakeCourses[0].name)).toBeInTheDocument()
    })
})
