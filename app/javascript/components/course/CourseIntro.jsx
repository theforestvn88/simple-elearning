import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAppContext } from '../../context/AppProvider'
import useApi from '../../hooks/useApi'

const CourseIntro = () => {
  const params = useParams()
  const {subject, identify} = useAppContext()
  const { BaseApi } = useApi()

  const [course, setCourse] = useState({})

  useEffect(() => {
    const courseUrl = `/api/v1/${subject}/${identify}/courses/${params.id}`
    BaseApi('GET', courseUrl, {}, {})
      .then((res) => {
        if (res.ok) {
          return res.json()
        }

        throw new Error('Something went wrong!')
      })
      .then((course) => setCourse(course))
      .catch(() => {})
  }, [params.id])

  return (
    <>
      <div className="p-6">
        <h1 className="display-4">{course.name}</h1>
      </div>
    </>
  )
}

export default CourseIntro
