import React, { act } from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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
    describe('CRUD courses', () => {
        beforeEach(async () => {
            jest.spyOn(react_router, "useParams").mockReturnValue({ id: 1 })
            localStorageMockReturn({token: 'xxx'})
            fetchMockReturn(fakeCourses[0])

            await act( async () => render(<MemoryRouter><AppProvider subject='instructor' identify='meta'><CourseDetail /></AppProvider></MemoryRouter>))
        })

        afterEach(() => {
            jest.restoreAllMocks()
        })

        it('show course info', async () => {
            expect(fetchMock).toHaveBeenCalledWith(
                '/api/v1/instructor/meta/courses/1', 
                {
                    'body': null, 
                    'headers': {'Content-Type': 'application/json', 'X-Auth-Token': 'xxx'}, 
                    'method': 'GET'
                })

            expect(screen.getByText(fakeCourses[0].name)).toBeInTheDocument()
        })

        it('show course milestones', async () => {
            fakeCourses[0].milestones.forEach((milestone) => {
                expect(screen.getByText(milestone.name)).toBeInTheDocument()
            })
        })

        it('show course lessons', async () => {
            fakeCourses[0].milestones[0].lessons.forEach((lesson) => {
                expect(screen.getByText(lesson.name)).toBeInTheDocument()
            })
        })

        it('add new course milestone', async () => {
            await act(async () => {
                fireEvent.click(screen.getByRole('button', {name: 'Add Milestone'}))
            })

            const fakeNewMilestone = {id: 6, name: 'a new milestone'}
            fetchMockReturn(fakeNewMilestone)

            await act(async () => {
                fireEvent.change(screen.getByLabelText(/Name/i), {target: {value: fakeNewMilestone.name}})
                fireEvent.click(screen.getByRole('button', {name: 'Submit'}))
            })

            expect(screen.getByText(fakeNewMilestone.name)).toBeInTheDocument()
        })

        it('edit course milestone', async () => {
            await act(async () => {
                fireEvent.click(screen.getAllByTestId('edit-milestone')[0])
            })

            const fakeUpdateMilestone = {id: 6, name: 'updated'}
            fetchMockReturn(fakeUpdateMilestone)

            await act(async () => {
                fireEvent.change(screen.getByLabelText(/Name/i), {target: {value: fakeUpdateMilestone.name}})
                fireEvent.click(screen.getByRole('button', {name: 'Submit'}))
            })

            expect(screen.getByText(fakeUpdateMilestone.name)).toBeInTheDocument()
        })

        it('delete course milestone', async () => {
            fetchMockReturn({})
            await act(async () => {
                fireEvent.click(screen.getAllByRole('button', {name: 'Delete'})[1])
            })

            const milestone1 = screen.queryByText(fakeCourses[0].milestones[0].name)
            expect(milestone1).toBeNull()
        })
    })

    describe('Course permission', () => {
        const aCourse = fakeCourses[2]

        beforeEach(async () => {
            jest.spyOn(react_router, "useParams").mockReturnValue({ id: 1 })
            localStorageMockReturn({token: 'xxx'})
            fetchMockReturn(aCourse)
        })
        
        afterEach(() => {
            jest.restoreAllMocks()
        })

        it('should not show Delete button if user is not allowed to edit course', async () => {
            await act( async () => render(<MemoryRouter><AppProvider subject='instructor' identify='meta'><CourseDetail /></AppProvider></MemoryRouter>))
            expect(screen.queryByTestId('delete-course')).not.toBeInTheDocument()
        })

        it('should not show Edit button if user is not allowed to edit course', async () => {
            await act( async () => render(<MemoryRouter><AppProvider subject='instructor' identify='meta'><CourseDetail /></AppProvider></MemoryRouter>))
            expect(screen.queryByTestId('edit-course')).not.toBeInTheDocument()
        })

        it('should not show Add Milestone if user is not allowed to edit course', async () => {
            await act( async () => render(<MemoryRouter><AppProvider subject='instructor' identify='meta'><CourseDetail /></AppProvider></MemoryRouter>))
            expect(screen.queryByTestId('add-new-milestone')).not.toBeInTheDocument()
        })

        it('should not show Delete Milestone if user is not allowed to edit course (delete milestone)', async () => {
            await act( async () => render(<MemoryRouter><AppProvider subject='instructor' identify='meta'><CourseDetail /></AppProvider></MemoryRouter>))
            expect(screen.queryByTestId('delete-milestone')).not.toBeInTheDocument()
        })

        it('should not show Edit Milestone if user is allowed to edit milestone', async () => {
            aCourse.milestones[0].can_edit = false
            await act( async () => render(<MemoryRouter><AppProvider subject='instructor' identify='meta'><CourseDetail /></AppProvider></MemoryRouter>))

            expect(screen.queryByTestId('edit-milestone')).not.toBeInTheDocument()
            aCourse.milestones[0].can_edit = true
        })

        
        it('should not show Add New Lesson if user is allowed to edit milestone', async () => {
            aCourse.milestones[0].can_edit = false
            await act( async () => render(<MemoryRouter><AppProvider subject='instructor' identify='meta'><CourseDetail /></AppProvider></MemoryRouter>))

            expect(screen.queryByTestId('add-new-lesson')).not.toBeInTheDocument()
            aCourse.milestones[0].can_edit = true
        })
    })
})
