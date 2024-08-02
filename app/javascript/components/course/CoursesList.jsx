import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useApi from '../hooks/useApi'
import CardListPlaceHolders from './CardListPlaceHolders'
import Paginaton from './Pagination'

const CoursesList = () => {
  const { BaseApi } = useApi()
  const [loading, setLoading] = useState(true)
  const [coursesData, setCoursesData] = useState({ courses: [], pagination: null })
  const [currPage, setCurrPage] = useState(1)

  useEffect(() => {
    setLoading(true)
    const coursesUrl = `/api/v1/courses?page=${currPage}`
    BaseApi('GET', coursesUrl)
      .then((res) => {
        setLoading(false)

        if (res.ok) {
          return res.json()
        }

        throw new Error('Something went wrong!')
      })
      .then((res) => {
        setCoursesData(res)
      })
      .catch(() => {})
  }, [currPage])

  const coursesList = coursesData.courses.map((course, index) => (
    <div key={index} className="card px-0 my-1 mx-2 border-secondary" style={{width: '18rem'}}>
      {course.cover ? (
        <img className="card-header p-0 card-img-top img-fluid w-100" src={course.cover.url} />
      ) : (
        <div className="card-header p-0 card-img-top img-fluid w-100"></div>
      )}
      <div className="card-body">
        <h5 className="card-title">{course.name}</h5>
        <p className="card-text">{course.summary}</p>
        <Link to={`/courses/${course.id}`} className="btn btn-primary">View Detail</Link>
      </div>
    </div>
  ))

  const emptyList = (
    <div className="vw-100 vh-50 d-flex align-items-center justify-content-center">
      <h4>No course!</h4>
    </div>
  )

  return (
    <>
      {loading ? (
        <CardListPlaceHolders rowSize={3} colSize={4} />
      ) : (
        <>
          <div className="text-end mb-3">
            <Link to="/courses/new" className="btn custom-button">
              Create New Course
            </Link>
          </div>
          <div className="container-fluid d-flex justify-content-start flex-wrap">
            {coursesData.courses.length > 0 ? coursesList : emptyList}
          </div>

          <br />

          {coursesData.pagination && (
            <Paginaton 
              pages={coursesData.pagination.pages} 
              currentPage={currPage} 
              selectedPage={setCurrPage} 
              totalPage={coursesData.pagination.total} />
          )}
        </>
      )}
    </>
  )
}

export default CoursesList
