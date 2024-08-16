import React, { act } from 'react'
import { render, screen } from '@testing-library/react'
import react_router, { MemoryRouter } from 'react-router-dom'
import { fetchMock, fetchMockReturn } from '../mocks/fetchMock'
import { fakeCourses } from '../mocks/fakeCourses'
import AppProvider from '../../context/AppProvider'
import CourseDetail from '../../components/course/CourseDetail'
import { localStorageMockReturn } from '../mocks/localStorageMock'

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
}))

describe('Course', () => {
    beforeEach(() => {
        jest.spyOn(react_router, "useParams").mockReturnValue({ id: 1 })
        localStorageMockReturn({token: 'xxx'})
        fetchMockReturn(fakeCourses[0])
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('should show course info', async () => {
        await act( async () => render(<MemoryRouter><AppProvider subject='instructor' identify='meta'><CourseDetail /></AppProvider></MemoryRouter>))

        expect(fetchMock).toHaveBeenCalledWith(
            '/api/v1/instructor/meta/courses/1', 
            {
                'body': null, 
                'headers': {'Content-Type': 'application/json', 'X-Auth-Token': 'xxx'}, 
                'method': 'GET'
            })

        expect(screen.getByText(fakeCourses[0].name)).toBeInTheDocument()
    })
})
