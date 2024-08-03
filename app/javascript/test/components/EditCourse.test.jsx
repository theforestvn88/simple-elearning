import React from 'react'
import { CourseFormCommonTests } from '../common/CourseFormTests'
import { fakeCourses } from '../mocks/fakeCourses'
import { MemoryRouter } from 'react-router-dom'
import AppProvider from '../../context/AppProvider'
import EditCourse from '../../components/course/EditCourse'

describe('EditCourse', () => {
    CourseFormCommonTests(<MemoryRouter><AppProvider subject='instructor' identify='meta'><EditCourse /></AppProvider></MemoryRouter>, fakeCourses[0], '/api/v1/instructor/meta/courses/1', 'PUT')
})
