import React from 'react'
import { CourseFormCommonTests } from '../common/CourseFormTests'
import EditCourse from '../../components/EditCourse'

describe('EditCourse', () => {
    CourseFormCommonTests(<EditCourse />, '/api/v1/courses/1', 'PUT')
})
