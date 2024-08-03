import React from 'react'
import { CourseFormCommonTests } from '../common/CourseFormTests'
import AppProvider from '../../context/AppProvider'
import { MemoryRouter } from 'react-router-dom'
import NewCourse from '../../components/course/NewCourse'

describe('NewCourse', () => {
    CourseFormCommonTests(<MemoryRouter><AppProvider subject='instructor' identify='meta'><NewCourse /></AppProvider></MemoryRouter>, null, '/api/v1/instructor/meta/courses', 'POST')
})
