import React, { act } from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { fetchMock, fetchMockReturn } from '../mocks/fetchMock'
import { fakeCourses } from '../mocks/fakeCourses'
import CoursesList from '../../components/course/CoursesList'
import AppProvider from '../../context/AppProvider'
import { localStorageMockReturn } from '../mocks/localStorageMock'
import { PaginationTests } from '../common/PaginationTests'

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
            "/api/v1/courses?page=1", 
            {"body": null, "headers": {"Content-Type": "application/json"}, "method": "GET"}
        )

        fakeCourses.forEach((course) => {
            expect(screen.getByText(course.name)).toBeInTheDocument()
            expect(screen.getByText(course.partner.name)).toBeInTheDocument()
        })
    })

    PaginationTests(
        <MemoryRouter><AppProvider subject='instructor' identify='meta'><CoursesList /></AppProvider></MemoryRouter>, 
        'courses',
        false // NO required authorized
    )

    it('slient refresh will-expired-token', async () => {
        localStorageMockReturn({token: 'xxx', token_expire_at: (new Date(Date.now() + 1000*60*60)).toUTCString()})

        await act( async () => render(<MemoryRouter><AppProvider subject='user' identify='*'><CoursesList /></AppProvider></MemoryRouter>))

        expect(fetchMock).toHaveBeenCalledWith('/api/auth/user/*/refresh_token', {
            "method": "POST",
            "headers": {"Content-Type": "application/json", "X-Auth-Token": "xxx"},
            "body": "{}"
        })
    })

    it('no need to refresh long-life-token', async () => {
        localStorageMockReturn({token: 'xxx', token_expire_at: (new Date(Date.now() + 1000*60*60*3)).toUTCString()})

        await act( async () => render(<MemoryRouter><AppProvider subject='user' identify='*'><CoursesList /></AppProvider></MemoryRouter>))

        expect(fetchMock).not.toHaveBeenCalledWith('/api/auth/user/*/refresh_token', {
            "method": "POST",
            "headers": {"Content-Type": "application/json", "X-Auth-Token": "xxx"},
            "body": "{}"
        })
    })
})
