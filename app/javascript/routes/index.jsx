import React from 'react'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
import Home from '../components/Home'
import Courses from '../components/Courses'
import Course from '../components/Course'
import NewCourse from '../components/NewCourse'
import EditCourse from '../components/EditCourse'
import CoursesList from '../components/CoursesList'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route 
        path="/"
        element={<Home />} 
      />
      <Route 
        path="/courses"
        element={<Courses />}
      >
        <Route 
          index
          element={<CoursesList />}
        />
        <Route 
          path="/courses/:id"
          element={<Course />}
        />
        <Route 
          path="/courses/new"
          element={<NewCourse />}
        />
        <Route 
          path="/courses/:id/edit"
          element={<EditCourse />}
        />
      </Route>
    </Route>
  )
)

export default (
  <RouterProvider router={router} />
)
