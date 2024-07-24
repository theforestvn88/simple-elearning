import React from 'react'
import { CourseFormCommonTests } from '../common/CourseFormTests'
import EditCourse from '../../components/EditCourse'
import { fakeCourses } from '../mocks/fakeCourses'
import { MemoryRouter } from 'react-router-dom'
import AppProvider from '../../context/AppProvider'

describe('EditCourse', () => {
    CourseFormCommonTests(<MemoryRouter><AppProvider><EditCourse /></AppProvider></MemoryRouter>, fakeCourses[0], '/api/v1/courses/1', 'PUT')
})
