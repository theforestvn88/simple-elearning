import React from "react"
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
import Auth from "../components/auth/Auth"
import LogIn from "../components/auth/LogIn"
import Partner from "../components/Partner.jsx"
import PartnerCourses from "../components/course/PartnerCourses.jsx"
import CoursesList from "../components/course/CoursesList.jsx"
import Course from "../components/course/CourseIntro.jsx"
import NewCourse from "../components/course/NewCourse.jsx"
import EditCourse from "../components/course/EditCourse.jsx"
import CourseDetail from "../components/course/CourseDetail.jsx"

const PartnerRouter = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route
                path="/partners/:slug"
                element={<Partner />} 
            />
            <Route 
                path='/partners/auth'
                element={<Auth />}>
                <Route 
                    path='/partners/auth/login'
                    element={<LogIn />}
                />
            </Route>
            <Route 
                path="/courses"
                element={<PartnerCourses />}>
                <Route 
                    index
                    element={<CoursesList />}
                />
                <Route 
                    path="/courses/:id"
                    element={<CourseDetail />}
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
    <RouterProvider router={PartnerRouter} />
)
