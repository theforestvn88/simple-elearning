import React from 'react'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
import Home from '../components/Home'
import Courses from '../components/course/Courses'
import CourseIntro from '../components/course/CourseIntro'
import CoursesList from '../components/course/CoursesList'
import Auth from '../components/auth/Auth'
import LogIn from '../components/auth/LogIn'
import SignUp from '../components/auth/SignUp'
import Account from '../components/account/Account'
import Settings from '../components/account/Setting'
import Profile from '../components/account/Profile'
import AuthenticationSetting from '../components/account/AuthenticationSetting'
import PreferencesSetting from '../components/account/PreferencesSetting'
import NotificationSetting from '../components/account/NotificationSetting'
import BillingSetting from '../components/account/BillingSetting'
import SessionSetting from '../components/account/SessionSetting'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route 
        path="/"
        element={<Home />} 
      />
      <Route 
        path='/auth'
        element={<Auth />}
      >
        <Route 
          path='/auth/login'
          element={<LogIn />}
        />
        <Route 
          path='/auth/signup'
          element={<SignUp />}
        />
      </Route>
      <Route 
        path='/account'
        element={<Account />}
      >
        <Route
          path='/account/:id/profile'
          element={<Profile />}
        />
        <Route
          path='/account/:id/settings'
          element={<Settings />}
        >
          <Route
            index
            element={<PreferencesSetting />}
          />
          <Route
            path='/account/:id/settings/auth'
            element={<AuthenticationSetting />}
          />
          <Route
            path='/account/:id/settings/session'
            element={<SessionSetting />}
          />
          <Route
            path='/account/:id/settings/notification'
            element={<NotificationSetting />}
          />
          <Route
            path='/account/:id/settings/billing'
            element={<BillingSetting />}
          />
        </Route>
      </Route>
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
          element={<CourseIntro />}
        />
      </Route>
    </Route>
  )
)

export default (
  <RouterProvider router={router} />
)
