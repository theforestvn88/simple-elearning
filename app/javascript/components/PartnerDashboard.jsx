import React, { useMemo } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

const PartnerDashBoard = () => {
    const location = useLocation()
    const currentTab = useMemo(() => {
      const parts = location.pathname.split("/")
      return parts[3]
    }, [location.pathname])

    return (<>
        <div className="row flex-nowrap border border-1">
          <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-light">
              <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 min-vh-100">
                <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="partner-menu">
                  <li className="nav-item">
                      <Link 
                        to={`assignments`} 
                        className={currentTab=='assignments' ? '' : 'text-decoration-none'}>
                        Assignments
                      </Link>
                  </li>
                  <li className="nav-item">
                      <Link 
                        to={`courses`}
                        className={currentTab=='courses' ? '' : 'text-decoration-none'}>
                        Courses
                      </Link>
                  </li>
                  <li className="nav-item">
                      <Link 
                        to={`instructors`}
                        className={currentTab=='instructors' ? '' : 'text-decoration-none'}>
                        Instructors
                      </Link>
                  </li>
                </ul>
              </div>
          </div>
          <div className="col py-3">
            <Outlet />
          </div>
        </div>
    </>)
}

export default PartnerDashBoard
