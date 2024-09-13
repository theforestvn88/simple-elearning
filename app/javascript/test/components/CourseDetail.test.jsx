import React, { act } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import react_router, { MemoryRouter } from 'react-router-dom'
import { fakeCourses } from '../mocks/fakeCourses'
import AppProvider from '../../context/AppProvider'
import CourseDetail from '../../components/course/CourseDetail'
import { MockApiReturn, RequireAuthorizedApiSpy, getSubmitBodyFromApiSpy, mockAuth } from '../mocks/useAppContextMock'

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
}))

describe('Course', () => {
    describe('Show Courses', () => {
        beforeEach(async () => {
            jest.spyOn(react_router, "useParams").mockReturnValue({ id: 1 })
            mockAuth({token: 'xxx'})
            MockApiReturn(fakeCourses[0])

            await act( async () => render(<MemoryRouter><AppProvider subject='instructor' identify='meta'><CourseDetail /></AppProvider></MemoryRouter>))
        })

        afterEach(() => {
            jest.restoreAllMocks()
        })

        it('show course info', async () => {
            expect(RequireAuthorizedApiSpy).toHaveBeenCalledWith(
                "GET", "/api/v1/subject/identify/courses/1"
            )

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
    })

    describe('Edit Course', () => {
        beforeEach(async () => {
            jest.spyOn(react_router, "useParams").mockReturnValue({ id: 1 })
            mockAuth({token: 'xxx'})
            MockApiReturn(fakeCourses[0])

            await act( async () => render(<MemoryRouter><AppProvider subject='instructor' identify='meta'><CourseDetail /></AppProvider></MemoryRouter>))
        })

        afterEach(() => {
            jest.restoreAllMocks()
        })

        it('add new course milestone', async () => {
            await act(async () => {
                fireEvent.click(screen.getByRole('button', {name: 'Add Milestone'}))
            })

            const fakeNewMilestone = {id: 6, name: 'a new milestone'}
            MockApiReturn(fakeNewMilestone)

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
            MockApiReturn(fakeUpdateMilestone)

            await act(async () => {
                fireEvent.change(screen.getByLabelText(/Name/i), {target: {value: fakeUpdateMilestone.name}})
                fireEvent.click(screen.getByRole('button', {name: 'Submit'}))
            })

            expect(screen.getByText(fakeUpdateMilestone.name)).toBeInTheDocument()
        })

        it('delete course milestone', async () => {
            MockApiReturn({})
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
            mockAuth({token: 'xxx'})
            MockApiReturn(aCourse)
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

    describe('Add Assigment', () => {
        const aCourse = fakeCourses[2]

        beforeEach(async () => {
            jest.spyOn(react_router, "useParams").mockReturnValue({ id: 1 })
            mockAuth({token: 'xxx', user: {rank: 'administrator'}}, 'instructor', 'meta')
            aCourse.can_edit = true
            MockApiReturn(aCourse)
        })
        
        afterEach(() => {
            jest.restoreAllMocks()
        })

        it('partner instructors suggestions', async () => {
            await act( async () => render(<MemoryRouter><AppProvider subject='instructor' identify='meta'><CourseDetail /></AppProvider></MemoryRouter>))

            MockApiReturn([{id: 1, email: 'prof1@example.com'}])
            await act(async () => {
                fireEvent.change(screen.getByLabelText(/Email/i), {target: {value: 'prof1'}})
            })

            expect(screen.getByText('prof1@example.com')).toBeInTheDocument()
        })

        it('submit assignment', async () => {
            await act( async () => render(<MemoryRouter><AppProvider subject='instructor' identify='meta'><CourseDetail /></AppProvider></MemoryRouter>))

            MockApiReturn([{id: 1, email: 'prof1@example.com'}])
            await act(async () => {
                fireEvent.change(screen.getByLabelText(/Email/i), {target: {value: 'prof1'}})
            })
            
            await act(async () => {
                fireEvent.click(screen.getByText('prof1@example.com'))
                fireEvent.submit(screen.getByTestId('add-assignment-form'))
            })

            expect(RequireAuthorizedApiSpy).toHaveBeenCalledWith(
                "POST", "/api/v1/instructor/meta/assignments", expect.any(FormData)
            )

            const formData = getSubmitBodyFromApiSpy()
            expect(formData['assignment[assignee_id]']).toEqual('1')
            expect(formData['assignment[assignee_type]']).toEqual('instructor')
            expect(formData['assignment[assignable_id]']).toEqual(`${aCourse.id}`)
            expect(formData['assignment[assignable_type]']).toEqual('course')
        })
    })

    describe('Cancel Assignment', () => {
        const aCourse = fakeCourses[2]

        beforeEach(async () => {
            jest.spyOn(react_router, "useParams").mockReturnValue({ id: 1 })
            mockAuth({token: 'xxx', user: {rank: 'administrator'}}, 'instructor', 'meta')
            aCourse.can_edit = true
            aCourse.assignees = [
                {
                    id: 1,
                    name: 'an assignee'
                }
            ]
            MockApiReturn(aCourse)
        })
        
        afterEach(() => {
            jest.restoreAllMocks()
        })

        it('confirm cancel assignment', async () => {
            await act( async () => render(<MemoryRouter><AppProvider subject='instructor' identify='meta'><CourseDetail /></AppProvider></MemoryRouter>))

            MockApiReturn({assignee: {id: 1}})
            await act(async () => {
                fireEvent.click(screen.getByRole('button', {name: '-'}))
            })
            await act( async () => {
                fireEvent.click(screen.getByRole('button', { name: 'Confirm'}))
            })

            expect(RequireAuthorizedApiSpy).toHaveBeenCalledWith(
                "DELETE", "/api/v1/instructor/meta/assignments/cancel", {assignment: {assignee_id: 1, assignable_id: aCourse.id}}
            )

            expect(screen.queryByText('an assignee')).not.toBeInTheDocument()
        })
    })
})
