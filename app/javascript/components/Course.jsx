import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'

const Course = () => {
  const navigate = useNavigate()
  const params = useParams()
  const [course, setCourse] = useState({})

  useEffect(() => {
    const courseUrl = `/api/v1/courses/${params.id}`
    fetch(courseUrl)
      .then((res) => {
        if (res.ok) {
          return res.json()
        }

        throw new Error('Something went wrong!')
      })
      .then((course) => setCourse(course))
      .catch(() => {})
  }, [params.id])

  const onDeleteCourse = (event) => {
    event.preventDefault()

    const token = '' //document.querySelector('meta[name="csrf-token"]').textContent;
    const deleteCourseUrl = `/api/v1/courses/${course.id}`

    fetch(deleteCourseUrl, {
      method: 'DELETE',
      headers: {
        'X-CSRF-TOKEN': token,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          navigate('/courses')
          // return;
        }
        throw new Error('Something went wrong!')
      })
      .catch((error) => console.log(error))
  }

  return (
    <div className="container">
      <div className="p-6">
        <h1 className="display-4">{course.name}</h1>
      </div>
      <div className="d-flex align-items-center justify-content-between">
        <Link to="/courses" className="btn btn-link">
          Back to courses
        </Link>
        <div className="d-flex align-items-center justify-content-end">
          <Link to={`/courses/${course.id}/edit`} className="btn btn-light">
            Edit
          </Link>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onDeleteCourse}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default Course
