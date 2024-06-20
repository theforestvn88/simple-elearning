import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CourseForm from './CourseForm'

const NewCourse = () => {
  const navigate = useNavigate()
  const [course, setCourse] = useState({ name: '' })

  const onChangeName = (event) => {
    setCourse((course) => ({ ...course, name: event.target.value }))
  }

  const onSubmit = (event) => {
    event.preventDefault()

    const token = '' //document.querySelector('meta[name="csrf-token"]').textContent;
    const createParams = { course: course }
    const createCourseUrl = '/api/v1/courses'

    fetch(createCourseUrl, {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createParams),
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw new Error('Something went wrong!')
      })
      .then((response) => navigate(`/courses/${response.id}`))
      .catch((error) => console.log(error))
  }

  return (
    <>
      <div className="row">
        <div className="col-sm-12 col-lg-6 offset-lg-3">
          <h1 className="font-weight-normal mb-5">Add a new course</h1>
          <CourseForm
            course={course}
            onChangeName={onChangeName}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </>
  )
}

export default NewCourse
