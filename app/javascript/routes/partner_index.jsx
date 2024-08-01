import React from "react"
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
import Auth from "../components/auth/Auth"
import LogIn from "../components/auth/LogIn"
import Partner from "../components/Partner.jsx"
import PartnerCourses from "../components/PartnerCourses.jsx"

const PartnerRouter = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route
                path="/partners/:slug"
                element={<Partner />} 
            />
            <Route 
                path='/partners/auth'
                element={<Auth />}
            >
                <Route 
                    path='/partners/auth/login'
                    element={<LogIn />}
                />
            </Route>
            <Route 
                path="/courses"
                element={<PartnerCourses />}
            >
            </Route>
        </Route>
    )
)

export default (
    <RouterProvider router={PartnerRouter} />
)
