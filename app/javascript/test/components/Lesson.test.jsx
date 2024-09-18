import React from 'react'
import { render, screen, act, fireEvent } from '@testing-library/react'
import react_router, { MemoryRouter } from 'react-router-dom'
import { localStorageMockReturn } from '../mocks/localStorageMock'
import { fetchMock, fetchMockReturn } from '../mocks/fetchMock'
import { LessonFormCommonTests } from '../common/LessonFormTests'
import AppProvider from '../../context/AppProvider'
import LessonForm from '../../components/course/LessonForm'
import Lesson from '../../components/course/Lesson'
import { MockApiReturn, mockAuth } from '../mocks/useAppContextMock'
import { EditAssignmentTests } from '../common/EditAssignmentTests'

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
}))

describe('Lesson', () => {
    beforeEach(async () => {
        jest.spyOn(react_router, "useParams").mockReturnValue({ course_id: 1, milestone_id: 1, id: 1 })
        localStorageMockReturn({token: 'xxx'})
        fetchMockReturn({
            id: 1,
            name: 'lesson 1', 
            estimated_minutes: 60,
            can_edit: true,
            can_delete: true
        })

        await act( async () => render(<MemoryRouter><AppProvider subject='partner' identify='meta'><Lesson /></AppProvider></MemoryRouter>))
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })
    
    it('show lesson info', async () => {
        expect(fetchMock).toHaveBeenCalledWith(
            '/api/v1/partner/meta/courses/1/milestones/1/lessons/1', 
            {
                'body': null, 
                'headers': {'Content-Type': 'application/json', 'X-Auth-Token': 'xxx'}, 
                'method': 'GET'
            })

        expect(screen.getByText('#1 lesson 1')).toBeInTheDocument()
    })

    it ('edit lesson', async () => {
        await act(async () => {
            fireEvent.click(screen.getAllByTestId('edit-lesson')[0])
        })

        expect(screen.getByTestId('submit-lesson-form')).toBeInTheDocument()
    })

    it('delete lesson', async () => {
        fetchMock.mockClear()
        fetchMock.mockRestore()
        fetchMockReturn({})
        await act(async () => {
            fireEvent.click(screen.getAllByTestId('delete-lesson')[0])
        })

        expect(fetchMock).toHaveBeenCalledWith(
            '/api/v1/partner/meta/courses/1/milestones/1/lessons/1', 
            {
                'body': "{}", 
                'headers': {'Content-Type': 'application/json', 'X-Auth-Token': 'xxx'}, 
                'method': 'DELETE'
            })
    })
})

describe('EditLessonForm', () => {
    LessonFormCommonTests(
        <MemoryRouter>
            <AppProvider subject='partner' identify='meta'>
                <LessonForm submitEndPoint={'/api/v1/instructor/meta/courses/1/milestones/1/lessons/1'} submitMethod={'PUT'} />
            </AppProvider>
        </MemoryRouter>, 
        {name: 'a lesson'}, 
        '/api/v1/instructor/meta/courses/1/milestones/1/lessons/1', 
        'PUT'
    )
})

describe('Lesson Permission', () => {
    const aLesson = {
        id: 1,
        name: 'lesson 1',
        estimated_minutes: 60,
        can_edit: false,
        can_delete: false,
    }
    beforeEach(async () => {
        jest.spyOn(react_router, "useParams").mockReturnValue({ course_id: 1, milestone_id: 1, id: 1 })
        localStorageMockReturn({token: 'xxx'})
        fetchMockReturn(aLesson)
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('should not show Edit button when user is not allowed to edit lesson', async () => {
        await act( async () => render(<MemoryRouter><AppProvider subject='partner' identify='meta'><Lesson /></AppProvider></MemoryRouter>))
        expect(screen.queryByTestId('edit-lesson')).not.toBeInTheDocument()
    })

    it('should not show Delete button when user is not allowed to delete lesson', async () => {
        await act( async () => render(<MemoryRouter><AppProvider subject='partner' identify='meta'><Lesson /></AppProvider></MemoryRouter>))
        expect(screen.queryByTestId('delete-lesson')).not.toBeInTheDocument()
    })
})

describe('Lesson Assignment', () => {
    const fakeLesson = {
        id: 1,
        name: 'lesson 1', 
        estimated_minutes: 60,
        can_edit: true,
        can_delete: true,
        assignees: [
            {
                id: 1,
                name: 'who'
            }
        ]
    }

    beforeEach(async () => {
        jest.spyOn(react_router, "useParams").mockReturnValue({ course_id: 1, milestone_id: 1, id: 1 })
        mockAuth({token: 'xxx', user: {rank: 'administrator'}}, 'instructor', 'meta')
        MockApiReturn(fakeLesson)
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    EditAssignmentTests(
        <MemoryRouter><AppProvider subject='partner' identify='meta'><Lesson /></AppProvider></MemoryRouter>, 0,
        'instructor', fakeLesson.assignees[0],
        'Lesson', fakeLesson.id
    )
})
