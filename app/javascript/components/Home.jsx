import React, { useEffect } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppProvider'
import Nav from './Nav'
import Breadcrumbs from './Breadcrumbs'

const Home = () => {
  const navigate = useNavigate()
  const { auth } = useAppContext()
  
  useEffect(() => {
    if (auth.hasBeenExpiredToken()) {
      console.log("EXPIRE ....")
      navigate("/auth/login")
    } else {
      navigate("courses")
    }
  }, [])

  const Intro = () => (
    <div className="vw-100 vh-100 primary-color d-flex align-items-center justify-content-center">
      <div className="jumbotron jumbotron-fluid bg-transparent">
        <div className="container secondary-color">
          <h1 className="display-4">Continuous Learning</h1>
          <p className="lead">
            A curated list of courses for expanding your skills and knowledge!
          </p>
          <hr className="my-4" />
          <Link to="/auth/login" className="btn btn-lg btn-secondary">
            Get Start
          </Link>
        </div>
      </div>
    </div>
  )

  return (!auth.info.token ? (
      <Intro />
    ) : (
      <div className="container py-5">
        <Nav basePath='/courses' />
        <Breadcrumbs homePath='/courses' />
        <Outlet />
      </div>
    ))
}

export default Home
