import React, { act } from 'react'
import { fireEvent, render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { fetchMock, fetchMockReturn } from '../mocks/fetchMock'
import { fakeCourses } from '../mocks/fakeCourses'
import CoursesList from '../../components/course/CoursesList'
import AppProvider from '../../context/AppProvider'

describe('CoursesList', () => {
    const FakePagination = { pages: ['1', '2', 'gap', '3', '4'], total: 10 }

    beforeEach(() => {
        fetchMockReturn({courses: fakeCourses, pagination: FakePagination })
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('should show courses list', async () => {
        await act( async () => render(<MemoryRouter><AppProvider subject='instructor' identify='meta'><CoursesList /></AppProvider></MemoryRouter>))

        expect(fetchMock).toHaveBeenCalledWith(
            '/api/v1/instructor/meta/courses?page=1', 
            {"body": null, "headers": {"Content-Type": "application/json"}, "method": "GET"}
        )

        fakeCourses.forEach((course) => {
            expect(screen.getByText(course.name)).toBeInTheDocument()
            expect(screen.getByText(course.partner.name)).toBeInTheDocument()
        })
    })

    describe('pagination', () => {
        beforeEach(() => {
            fetchMock.mockClear()
            fetchMock.mockRestore()
            fetchMockReturn({courses: fakeCourses, pagination: FakePagination })
            
            cleanup()
        })

        afterEach(() => {
            jest.clearAllMocks()
            jest.restoreAllMocks()
        })

        it('show pagination pages', async () => {
            await act( async () => render(<MemoryRouter><AppProvider subject='instructor' identify='meta'><CoursesList /></AppProvider></MemoryRouter>))

            for(let page = 1; page <= 4; page++) {
                expect(screen.getByRole('button', {name: page})).toBeInTheDocument()
            }
            expect(screen.getByRole('button', {name: 'First'})).toBeInTheDocument()
            expect(screen.getByRole('button', {name: 'Last'})).toBeInTheDocument()
        })

        it('click on normal page should start loading that page courses', async () => {
            await act( async () => render(<MemoryRouter><AppProvider subject='instructor' identify='meta'><CoursesList /></AppProvider></MemoryRouter>))

            await act( async () => {
                fireEvent.click(screen.getByRole('button', {name: 2}))
            })

            expect(fetchMock).toHaveBeenCalledWith(
                '/api/v1/instructor/meta/courses?page=2', 
                {"body": null, "headers": {"Content-Type": "application/json"}, "method": "GET"}
            )
        })

        it('click on the last page should start loading the last page courses', async () => {
            await act( async () => render(<MemoryRouter><AppProvider subject='instructor' identify='meta'><CoursesList /></AppProvider></MemoryRouter>))

            await act( async () => {
                fireEvent.click(screen.getByRole('button', {name: 'Last'}))
            })
    
            expect(fetchMock).toHaveBeenCalledWith(
                '/api/v1/instructor/meta/courses?page=10', 
                {"body": null, "headers": {"Content-Type": "application/json"}, "method": "GET"}
            )
        })

        it('click on the first page should start loading the first page courses', async () => {
            await act( async () => render(<MemoryRouter><AppProvider subject='instructor' identify='meta'><CoursesList /></AppProvider></MemoryRouter>))

            await act( async () => {
                fireEvent.click(screen.getByRole('button', {name: 'First'}))
            })
    
            expect(fetchMock).toHaveBeenCalledWith(
                '/api/v1/instructor/meta/courses?page=1', 
                {"body": null, "headers": {"Content-Type": "application/json"}, "method": "GET"}
            )
        })
    })
})
