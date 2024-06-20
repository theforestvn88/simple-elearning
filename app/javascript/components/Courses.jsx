import React, { useState, useEffect } from 'react'
import { Link, Outlet } from 'react-router-dom'
import Breadcrumbs from './Breadcrumbs'

const Courses = () => {
  return (
    <>
      <div className="container py-5">
        <Breadcrumbs/>
        <Outlet />
      </div>
    </>
  )
}

export default Courses
