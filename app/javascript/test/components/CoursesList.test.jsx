import React, { act } from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CoursesList from '../../components/CoursesList'
import { fetchMock, fetchMockReturn } from '../mocks/fetchMock'
import { fakeCourses } from '../mocks/fakeCourses'

describe('CoursesList', () => {
    beforeEach(() => {
        fetchMockReturn(fakeCourses)
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('should show courses list', async () => {
        await act( async () => render(<MemoryRouter><CoursesList /></MemoryRouter>))

        expect(fetchMock).toHaveBeenCalledWith('/api/v1/courses')

        fakeCourses.forEach((course) => {
            expect(screen.getByText(course.name)).toBeInTheDocument()
        })
    })
})
