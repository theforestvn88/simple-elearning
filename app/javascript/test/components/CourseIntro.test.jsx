import React, { act } from 'react'
import { render, screen } from '@testing-library/react'
import react_router, { MemoryRouter } from 'react-router-dom'
import { fetchMock, fetchMockReturn } from '../mocks/fetchMock'
import { fakeCourses } from '../mocks/fakeCourses'
import AppProvider from '../../context/AppProvider'
import CourseIntro from '../../components/course/CourseIntro'

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
        await act( async () => render(<MemoryRouter><AppProvider subject='user' identify='*'><CourseIntro /></AppProvider></MemoryRouter>))

        expect(fetchMock).toHaveBeenCalledWith('/api/v1/user/*/courses/1', {'body': null, 'headers': {'Content-Type': 'application/json'}, 'method': 'GET'})

        expect(screen.getByText(fakeCourses[0].name)).toBeInTheDocument()
    })
})
