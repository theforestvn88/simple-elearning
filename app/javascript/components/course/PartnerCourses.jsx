import React from 'react'
import { Outlet } from 'react-router-dom'
 
const PartnerCourses = () => {
  return (
    <>
      <div className="container py-5">
        <Outlet />
      </div>
    </>
  )
}

export default PartnerCourses
