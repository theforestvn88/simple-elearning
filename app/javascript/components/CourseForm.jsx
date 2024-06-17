import React from 'react'

const CourseForm = ({ course, onSubmit, onChangeName }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="courseName">Course name</label>
        <input
          type="text"
          id="courseName"
          name="name"
          value={course.name}
          placeholder="Name"
          className="form-control"
          required
          onChange={onChangeName}
        />
      </div>
      <button type="submit" className="btn custom-button mt-3">
        Submit
      </button>
    </form>
  )
}

export default CourseForm
