import React, { useEffect, useMemo } from 'react'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../context/AppProvider'
import Breadcrumbs from './Breadcrumbs'
import Nav from './Nav'
import LogIn from './auth/LogIn'

const Partner = () => {
  const BasePath = useMemo(() => {
    return location.pathname.split("/").slice(0, 3).join('/')
  })

  const { identify, auth } = useAppContext()

  useEffect(() => {
    if (auth.willExpiredToken()) {
      auth.refreshToken()
    }
  }, [])

  return (<>
    <div className="container py-5">
      <Nav title={identify} basePath={BasePath} showAuth={false} />
      {(!auth.info.token || auth.hasBeenExpiredToken()) ? (
        <LogIn showSignUp={false} />
      ) : (
        <>
          <Breadcrumbs homePath={BasePath} />
          <Outlet />
        </>
      )}
    </div>
  </>)
}

export default Partner
