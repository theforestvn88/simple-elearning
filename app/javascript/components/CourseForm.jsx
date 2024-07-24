import React, { useState } from 'react'
import SingleFileUploader from "./SingleFileUploader"
import { useAppContext } from '../context/AppProvider'

const CourseForm = ({ course, submitEndPoint, submitMethod, onSubmitSuccess, onSubmitError }) => {
  const { RequireAuthorizedApi } = useAppContext()
  const courseData = new FormData()

  const onChange = (event) => {
    courseData.set(`course[${event.target.name}]`, event.target.value)
  }

  const onChangeCover = (coverBlobSignedId) => {
    courseData.set(`course[cover]`, coverBlobSignedId)
  }

  const onSubmit = async (event) => {
    event.preventDefault()

    RequireAuthorizedApi(submitMethod, submitEndPoint, {
        'Content-Type': 'multipart/form-data'
    }, courseData)
    .then((response) => {
      if (response.ok) {
          return response.json()
      } else if (response.status == 401) {
          navigate('/auth/login')
          return
      }

      throw new Error('Something went wrong!')
    })
    .then((responseCourse) => {
      onSubmitSuccess(responseCourse)
    })
    .catch((error) => {
      onSubmitError(error)
    })
}

  return (
    <form onSubmit={onSubmit} data-testid="submit-course-form">
      <div className="form-group">
        <label htmlFor="courseName">Course name</label>
        <input
          type="text"
          id="courseName"
          name="name"
          defaultValue={course.name}
          placeholder="Name"
          className="form-control"
          required
          onChange={onChange}
        />

        <label htmlFor="courseSummary">Course summary</label>
        <input
          type="text"
          id="courseSummary"
          name="summary"
          defaultValue={course.summary}
          placeholder="Summary"
          className="form-control"
          required
          onChange={onChange}
        />

        <label htmlFor="courseCover">Cover</label>
        <SingleFileUploader
            id="courseCover"
            name="cover"
            acceptedFiles="image/jpeg,image/jpg,image/png"
            maxFilesize={2000}
            file={course.cover}
            uploadedFile={(imageBlobSignedId) => {
              onChangeCover(imageBlobSignedId)
            }}
            unloadedFile={_ => {
              onChangeCover('')
            }}
        />

        <label htmlFor="courseDescription">Course description</label>
        <input
          type="text"
          id="courseDescription"
          name="description"
          defaultValue={course.description}
          placeholder="Description"
          className="form-control"
          required
          onChange={onChange}
        />
      </div>
      <button type="submit" className="btn btn-dark mt-3">
        Submit
      </button>
    </form>
  )
}

export default CourseForm
