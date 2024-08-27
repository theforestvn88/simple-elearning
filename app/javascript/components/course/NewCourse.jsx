import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CourseForm from './CourseForm'
import { useAppContext } from '../../context/AppProvider'

const NewCourse = () => {
  const navigate = useNavigate()
  const { subject, identify } = useAppContext()
  const [course, setCourse] = useState({ name: '', summary: '', description: '' })

  const onSubmitSuccess = (responseCourse) => {
    setCourse(responseCourse)
    navigate(`../${responseCourse.id}`)
  }

  const onSubmitError = (error) => {
    console.log(error)
  }

  return (
    <>
      <h1 className="font-weight-normal mb-5">Add a new course</h1>
      <CourseForm
        course={course}
        submitEndPoint={`/api/v1/${subject}/${identify}/courses`}
        submitMethod={'POST'}
        onSubmitSuccess={onSubmitSuccess}
        onSubmitError={onSubmitError}
      />
    </>
  )
}

export default NewCourse
