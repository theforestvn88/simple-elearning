import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CourseForm from './CourseForm'
import { useAppContext } from '../../context/AppProvider'
import usePathFinder from '../../hooks/usePathFinder'

const EditCourse = () => {
  const navigate = useNavigate()
  const params = useParams()
  const { RequireAuthorizedApi } = useAppContext()
  const { courseApiUrl, coursePath } = usePathFinder()
  const [course, setCourse] = useState({})

  useEffect(() => {
    RequireAuthorizedApi('GET', courseApiUrl(params.id))
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
      <Link to={coursePath(course.id)}>Back to course</Link>
      <h1 className="font-weight-normal mb-5">Edit course</h1>
      <CourseForm
        course={course}
        submitEndPoint={courseApiUrl(course.id)}
        submitMethod={'PUT'}
        onSubmitSuccess={onSubmitSuccess}
        onSubmitError={onSubmitError}
      />
    </>
  )
}

export default EditCourse
