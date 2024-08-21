import React from 'react'
import { render, screen, act, fireEvent } from '@testing-library/react'
import react_router, { MemoryRouter } from 'react-router-dom'
import { localStorageMockReturn } from '../mocks/localStorageMock'
import { fetchMock, fetchMockReturn } from '../mocks/fetchMock'
import { LessonFormCommonTests } from '../common/LessonFormTests'
import AppProvider from '../../context/AppProvider'
import LessonForm from '../../components/course/LessonForm'
import Lesson from '../../components/course/Lesson'

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
}))

describe('Lesson', () => {
    beforeEach(async () => {
        jest.spyOn(react_router, "useParams").mockReturnValue({ course_id: 1, milestone_id: 1, id: 1 })
        localStorageMockReturn({token: 'xxx'})
        fetchMockReturn({name: 'lesson 1', estimated_minutes: 60})

        await act( async () => render(<MemoryRouter><AppProvider subject='instructor' identify='meta'><Lesson /></AppProvider></MemoryRouter>))
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })
    
    it('show lesson info', async () => {
        expect(fetchMock).toHaveBeenCalledWith(
            '/api/v1/instructor/meta/courses/1/milestones/1/lessons/1', 
            {
                'body': null, 
                'headers': {'Content-Type': 'application/json', 'X-Auth-Token': 'xxx'}, 
                'method': 'GET'
            })

        expect(screen.getByText('lesson 1')).toBeInTheDocument()
    })

    it ('edit lesson', async () => {
        await act(async () => {
            fireEvent.click(screen.getAllByRole('button', {name: 'Edit'})[0])
        })

        expect(screen.getByTestId('submit-lesson-form')).toBeInTheDocument()
    })

    it('delete lesson', async () => {
        fetchMock.mockClear()
        fetchMock.mockRestore()
        fetchMockReturn({})
        await act(async () => {
            fireEvent.click(screen.getAllByRole('button', {name: 'Delete'})[0])
        })

        expect(fetchMock).toHaveBeenCalledWith(
            '/api/v1/instructor/meta/courses/1/milestones/1/lessons/1', 
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
            <AppProvider subject='instructor' identify='meta'>
                <LessonForm submitEndPoint={'/api/v1/instructor/meta/courses/1/milestones/1/lessons/1'} submitMethod={'PUT'} />
            </AppProvider>
        </MemoryRouter>, 
        {name: 'a lesson'}, 
        '/api/v1/instructor/meta/courses/1/milestones/1/lessons/1', 
        'PUT'
    )
})