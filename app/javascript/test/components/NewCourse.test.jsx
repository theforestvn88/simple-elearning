import React from 'react'
import { CourseFormCommonTests } from '../common/CourseFormTests'
import NewCourse from '../../components/NewCourse'

describe('NewCourse', () => {
    CourseFormCommonTests(<NewCourse />, '/api/v1/courses', 'POST')
})
