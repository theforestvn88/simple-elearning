import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useApi from '../../hooks/useApi'
import usePathFinder from '../../hooks/usePathFinder'

const CourseIntro = () => {
  const params = useParams()
  const { courseApiUrl } = usePathFinder()
  const { QueryApi } = useApi()

  const [course, setCourse] = useState({})

  useEffect(() => {
    QueryApi(courseApiUrl(params.id))
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
