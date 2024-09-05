import React from "react"
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
import Auth from "../components/auth/Auth"
import LogIn from "../components/auth/LogIn"
import Partner from "../components/Partner.jsx"
import PartnerCourses from "../components/course/PartnerCourses.jsx"
import CoursesList from "../components/course/CoursesList.jsx"
import NewCourse from "../components/course/NewCourse.jsx"
import EditCourse from "../components/course/EditCourse.jsx"
import CourseDetail from "../components/course/CourseDetail.jsx"
import NewLesson from "../components/course/NewLesson.jsx"
import Lesson from "../components/course/Lesson.jsx"
import Assignments from "../components/Assignments.jsx"
import Account from "../components/account/Account.jsx"
import Profile from "../components/account/Profile.jsx"
import Settings from "../components/account/Setting.jsx"
import PreferencesSetting from "../components/account/PreferencesSetting.jsx"
import AuthenticationSetting from "../components/account/AuthenticationSetting.jsx"
import SessionSetting from "../components/account/SessionSetting.jsx"
import NotificationSetting from "../components/account/NotificationSetting.jsx"
import BillingSetting from "../components/account/BillingSetting.jsx"
import PartnerDashBoard from "../components/PartnerDashboard.jsx"

const PartnerRouter = createBrowserRouter(
    createRoutesFromElements(
        <Route
            path="/partners/:slug"
            element={<Partner />}>
            <Route
                path="/partners/:slug"
                element={<PartnerDashBoard />} >
                <Route
                    path="/partners/:slug/assignments"
                    element={<Assignments />} 
                />
                <Route 
                    path="/partners/:slug/courses"
                    element={<PartnerCourses />}>
                    <Route 
                        index
                        element={<CoursesList />}
                    />
                    <Route 
                        path="/partners/:slug/courses/:id"
                        element={<CourseDetail />}
                    />
                    <Route 
                        path="/partners/:slug/courses/new"
                        element={<NewCourse />}
                    />
                    <Route 
                        path="/partners/:slug/courses/:id/edit"
                        element={<EditCourse />}
                    />
                    <Route 
                        path="/partners/:slug/courses/:course_id/milestones/:milestone_id/lessons/new"
                        element={<NewLesson />}
                    />
                    <Route 
                        path="/partners/:slug/courses/:course_id/milestones/:milestone_id/lessons/:id"
                        element={<Lesson />}
                    />
                </Route>
            </Route>
            <Route 
                path='/partners/:slug/account'
                element={<Account />}>
                <Route
                    path='/partners/:slug/account/:id/profile'
                    element={<Profile />}
                />
                <Route
                    path='/partners/:slug/account/:id/settings'
                    element={<Settings />}>
                    <Route
                        index
                        element={<PreferencesSetting />}
                    />
                    <Route
                        path='/partners/:slug/account/:id/settings/auth'
                        element={<AuthenticationSetting />}
                    />
                    <Route
                        path='/partners/:slug/account/:id/settings/session'
                        element={<SessionSetting />}
                    />
                    <Route
                        path='/partners/:slug/account/:id/settings/notification'
                        element={<NotificationSetting />}
                    />
                    <Route
                        path='/partners/:slug/account/:id/settings/billing'
                        element={<BillingSetting />}
                    />
                </Route>
            </Route>
        </Route>
    )
)

export default (
    <RouterProvider router={PartnerRouter} />
)
