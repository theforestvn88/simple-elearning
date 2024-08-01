import React from 'react'
import { Outlet } from 'react-router-dom'
import Breadcrumbs from './Breadcrumbs'
import Nav from './Nav'
 
const PartnerCourses = () => {
  return (
    <>
      <div className="container py-5">
        <Nav />
        <Breadcrumbs />
        <Outlet />
      </div>
    </>
  )
}

export default PartnerCourses
