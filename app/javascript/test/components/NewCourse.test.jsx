import React from 'react'
import { CourseFormCommonTests } from '../common/CourseFormTests'
import NewCourse from '../../components/NewCourse'
import AppProvider from '../../context/AppProvider'
import { MemoryRouter } from 'react-router-dom'

describe('NewCourse', () => {
    CourseFormCommonTests(<MemoryRouter><AppProvider><NewCourse /></AppProvider></MemoryRouter>, null, '/api/v1/courses', 'POST')
})
