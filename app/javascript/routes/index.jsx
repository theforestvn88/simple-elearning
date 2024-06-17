import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../components/Home'
import Courses from '../components/Courses'
import Course from '../components/Course'
import NewCourse from '../components/NewCourse'
import EditCourse from '../components/EditCourse'

export default (
  <BrowserRouter>
    {/* https://reactrouter.com/en/v6.3.0/upgrading/v5#upgrade-all-switch-elements-to-routes */}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:id" element={<Course />} />
      <Route path="/courses/new" element={<NewCourse />} />
      <Route path="/courses/:id/edit" element={<EditCourse />} />
    </Routes>
  </BrowserRouter>
)
