import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CourseForm from './CourseForm'

const EditCourse = () => {
  const navigate = useNavigate()
  const params = useParams()
  const [course, setCourse] = useState({})

  useEffect(() => {
    fetch(`/api/v1/courses/${params.id}`)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw new Error('Something went wrong!')
      })
      .then((response) => setCourse(response))
      .catch((error) => console.log(error))
  }, [params.id])

  const onChangeName = (event) =>
    setCourse((course) => ({ ...course, name: event.target.value }))

  const onSubmit = (event) => {
    event.preventDefault()

    const token = '' //document.querySelector('meta[name="csrf-token"]').textContent;
    const updateCourseUrl = `/api/v1/courses/${course.id}`
    const updateParams = {
      course: {
        name: course.name,
      },
    }

    fetch(updateCourseUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': token,
      },
      body: JSON.stringify(updateParams),
    })
      .then((response) => {
        if (response.ok) {
          navigate(`/courses/${course.id}`)
          return
        }
        throw new Error('Something went wrong!')
      })
      .catch((error) => console.log(error))
  }

  return (
    <div className="container mt-5">
      <Link to="/courses" className="btn btn-link mt-3">
        Back to courses
      </Link>

      <div className="row">
        <div className="col-sm-12 col-lg-6 offset-lg-3">
          <h1 className="font-weight-normal mb-5">Edit course</h1>
          <CourseForm
            course={course}
            onChangeName={onChangeName}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </div>
  )
}

export default EditCourse
