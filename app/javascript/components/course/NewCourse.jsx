import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CourseForm from './CourseForm'
import usePathFinder from '../../hooks/usePathFinder'

const NewCourse = () => {
  const navigate = useNavigate()
  const { newCourseApiUrl } = usePathFinder()
  const [course, setCourse] = useState({ name: '', summary: '', description: '' })

  const onSubmitSuccess = (responseCourse) => {
    setCourse(responseCourse)
    navigate(`../${responseCourse.id}`, { relative: "path" })
  }

  const onSubmitError = (error) => {
    console.log(error)
  }

  return (
    <>
      <h1 className="font-weight-normal mb-5">Add a new course</h1>
      <CourseForm
        course={course}
        submitEndPoint={newCourseApiUrl}
        submitMethod={'POST'}
        onSubmitSuccess={onSubmitSuccess}
        onSubmitError={onSubmitError}
      />
    </>
  )
}

export default NewCourse
