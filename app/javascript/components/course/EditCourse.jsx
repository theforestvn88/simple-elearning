import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CourseForm from './CourseForm'
import { useAppContext } from '../../context/AppProvider'

const EditCourse = () => {
  const navigate = useNavigate()
  const params = useParams()
  const { subject, identify, RequireAuthorizedApi } = useAppContext()
  const [course, setCourse] = useState({})

  useEffect(() => {
    RequireAuthorizedApi('GET', `/api/v1/${subject}/${identify}/courses/${params.id}`)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw new Error('Something went wrong!')
      })
      .then((response) => setCourse(response))
      .catch((error) => console.log(error))
  }, [params.id])

  const onSubmitSuccess = (responseCourse) => {
    navigate(-1)
  }

  const onSubmitError = (error) => {
    console.log(error)
  }

  return (
    <>
      <h1 className="font-weight-normal mb-5">Edit course</h1>
      <CourseForm
        course={course}
        submitEndPoint={`/api/v1/${subject}/${identify}/courses/${course.id}`}
        submitMethod={'PUT'}
        onSubmitSuccess={onSubmitSuccess}
        onSubmitError={onSubmitError}
      />
    </>
  )
}

export default EditCourse
