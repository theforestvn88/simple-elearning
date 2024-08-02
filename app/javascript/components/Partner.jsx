import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppContext } from '../context/AppProvider'
import PartnerCourses from './course/PartnerCourses'

const Partner = () => {
  const { identify, auth } = useAppContext()

  useEffect(() => {
    if (auth.willExpiredToken()) {
      auth.refreshToken()
    }
  }, [])

  return (!auth.info.token || auth.hasBeenExpiredToken()) ? (
    <Navigate to="/partners/auth/login" replace={true} />
  ) : (
    <Navigate to="/courses" replace={true} />
  )
}

export default Partner
