import React from 'react'
import { CourseFormCommonTests } from '../common/CourseFormTests'
import AppProvider from '../../context/AppProvider'
import { MemoryRouter } from 'react-router-dom'
import NewCourse from '../../components/course/NewCourse'

describe('NewCourse', () => {
    CourseFormCommonTests(<MemoryRouter><AppProvider subject='partner' identify='meta'><NewCourse /></AppProvider></MemoryRouter>, null, '/api/v1/partner/meta/courses', 'POST')
})
