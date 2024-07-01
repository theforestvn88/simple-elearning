import React, { useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAppContext } from '../context/AppProvider'

const Home = () => {
  const { auth } = useAppContext()
  
  useEffect(() => {
    if (auth.willExpiredToken()) {
      auth.refreshToken()
    }
  }, [])

  return ( !auth.info.token ? (
      <div className="vw-100 vh-100 primary-color d-flex align-items-center justify-content-center">
        <div className="jumbotron jumbotron-fluid bg-transparent">
          <div className="container secondary-color">
            <h1 className="display-4">Continuous Learning</h1>
            <p className="lead">
              A curated list of courses for expanding your skills and knowledge!
            </p>
            <hr className="my-4" />
            <Link to="/courses" relative="path" className="btn btn-lg btn-secondary">
              Get Start
            </Link>
          </div>
        </div>
      </div>
    ) : (
      auth.hasBeenExpiredToken() ? (
        <Navigate to="/auth/login" replace={true} />
      ) : (
        <Navigate to="/courses" replace={true} />
      )
    )
  )
}

export default Home
