import React from 'react'
import { LessonFormCommonTests } from '../common/LessonFormTests'
import AppProvider from '../../context/AppProvider'
import { MemoryRouter } from 'react-router-dom'
import LessonForm from '../../components/course/LessonForm'

describe('NewLesson', () => {
    LessonFormCommonTests(
        <MemoryRouter>
            <AppProvider subject='instructor' identify='meta'>
                <LessonForm submitEndPoint={'/api/v1/instructor/meta/courses/1/milestones/1/lessons'} submitMethod={'POST'} />
            </AppProvider>
        </MemoryRouter>, 
        null, 
        '/api/v1/instructor/meta/courses/1/milestones/1/lessons', 
        'POST'
    )
})
