import { useState } from "react"

const TokenCacheKey = 'open-courses-token'
const UserCacheKey = 'open-courses-current-user'

const useAuth = () => {
    const [token, setToken] = useState(localStorage.getItem(TokenCacheKey) || null)
    const [user, setUser] = useState(localStorage.getItem(UserCacheKey) || {})

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
            setToken(response.token)
            localStorage.setItem(TokenCacheKey, response.token)
            setUser(response.user)
            localStorage.setItem(UserCacheKey, response.user)

            return response
        })
    }
    
    const logout = async () => {
        const logoutUrl = '/api/auth/logout'
    
        return fetch(logoutUrl, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': token
          },
        })
        .then((response) => {
          if (response.ok) {
            return response.json()
          }
          throw new Error('Something went wrong!')
        })
        .then((response) => {
            console.log(response)
            setToken(null)
            localStorage.removeItem(TokenCacheKey)
            setUser({})
            localStorage.removeItem(UserCacheKey)

            return response
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
            setToken(response.token)
            localStorage.setItem(TokenCacheKey, response.token)
            setUser(response.user)
            localStorage.setItem(UserCacheKey, response.user)

            return response
        })
    }

    return {
        token,
        user,
        login,
        logout,
        signup
    }
}

export default useAuth
