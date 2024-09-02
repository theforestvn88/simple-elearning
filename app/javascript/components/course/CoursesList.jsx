import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import CardListPlaceHolders from '../CardListPlaceHolders'
import Paginaton from '../Pagination'
import UserAvatar from '../UserAvatar'
import { useAppContext } from '../../context/AppProvider'
import useApiQuery from '../../hooks/useApiQuery'

const CoursesList = () => {
  const { auth } = useAppContext()
  const { setQuery, responseData } = useApiQuery('/courses')
  const [currPage, setCurrPage] = useState(1)

  useEffect(() => {
    if (auth.willExpiredToken()) {
      auth.refreshToken()
    }
  }, [])

  useEffect(() => {
    setQuery({page: currPage})
  }, [currPage])

  const coursesList = responseData.data.courses?.map((course, index) => (
    <div key={index} className="card px-0 my-1 mx-2 border-secondary" style={{width: '18rem'}}>
      {course.cover ? (
        <img className="card-header p-0 card-img-top img-fluid w-100" src={course.cover.url} />
      ) : (
        <div className="card-header p-0 card-img-top img-fluid w-100"></div>
      )}
      <div className="card-body">
        <UserAvatar user={course.partner} size={20} showName={true} />
        <h5 className="card-title">{course.name}</h5>
        <p className="card-text">{course.summary}</p>
        <Link to={`${course.id}`} className="btn btn-primary">View Detail</Link>
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
      {responseData.loading ? (
        <CardListPlaceHolders rowSize={3} colSize={4} />
      ) : (
        <>
          <div className="text-end mb-3">
            <Link to="new" className="btn custom-button">
              Create New Course
            </Link>
          </div>
          <div className="container-fluid d-flex justify-content-start flex-wrap">
            {(responseData.data.courses && responseData.data.courses.length > 0) ? coursesList : emptyList}
          </div>

          <br />

          {responseData.data.pagination && (
            <Paginaton 
              pages={responseData.data.pagination.pages} 
              currentPage={currPage} 
              selectedPage={setCurrPage} 
              totalPage={responseData.data.pagination.total} />
          )}
        </>
      )}
    </>
  )
}

export default CoursesList
