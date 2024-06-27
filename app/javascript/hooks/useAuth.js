import { useState } from "react"

const AuthCacheKey = 'open-courses-auth'

const useAuth = () => {
    const [authInfo, setAuthInfo] = useState(JSON.parse(localStorage.getItem(AuthCacheKey) || '{}'))
    
    const login = async (loginParams) => {
        const loginUrl = '/api/auth/login'
    
        return fetch(loginUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginParams),
        })
        .then((response) => {
          if (response.ok) {
            return response.json()
          }
          throw new Error('Something went wrong!')
        })
        .then((response) => {
            console.log(response)
            localStorage.setItem(AuthCacheKey, JSON.stringify({
              ...authInfo,
              token: response.token,
              user: response.user
            }))
            setAuthInfo(JSON.parse(localStorage.getItem(AuthCacheKey)))

            return response
        })
    }
    
    const logout = async () => {
        const logoutUrl = '/api/auth/logout'
    
        return fetch(logoutUrl, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': authInfo.token
          },
        })
        .then((response) => {
          if (response.status == 200 || response.status == 401) {
            console.log(response)
            localStorage.removeItem(AuthCacheKey)
            setAuthInfo({})

            return response.json()
          }

          throw new Error('Something went wrong!')
        })
    }

    const signup = async (signupParams) => {
        const loginUrl = '/api/auth/signup'
    
        fetch(loginUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(signupParams),
        })
        .then((response) => {
          if (response.ok) {
            return response.json()
          }
          throw new Error('Something went wrong!')
        })
        .then((response) => {
            console.log(response)
            localStorage.setItem(AuthCacheKey, JSON.stringify({
              ...authInfo,
              token: response.token,
              user: response.user
            }))
            setAuthInfo(JSON.parse(localStorage.getItem(AuthCacheKey)))

            return response
        })
    }

    return {
        authInfo,
        login,
        logout,
        signup
    }
}

export default useAuth
