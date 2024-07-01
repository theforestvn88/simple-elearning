import { useState } from "react"

const AuthCacheKey = 'open-courses-auth'

const useAuth = () => {
    const [authInfo, setAuthInfo] = useState(JSON.parse(localStorage.getItem(AuthCacheKey) || '{}'))
    
    const saveAuthInfo = (newAuthInfo) => {
      const mergeAuthInfo = {
        ...authInfo,
        token: newAuthInfo.token || token_expire_at.token,
        token_expire_at: newAuthInfo.token_expire_at || authInfo.token_expire_at,
        user: newAuthInfo.user || authInfo.user
      }
      localStorage.setItem(AuthCacheKey, JSON.stringify(mergeAuthInfo))
      setAuthInfo(JSON.parse(localStorage.getItem(AuthCacheKey)))
    }

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
        .then((loginInfo) => {
            console.log(loginInfo)
            saveAuthInfo(loginInfo)
            return loginInfo
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
        .then((signupInfo) => {
            console.log(signupInfo)
            saveAuthInfo(signupInfo)
            return signupInfo
        })
    }

    const hasBeenExpiredToken = () => {
      return authInfo.token_expire_at && (Date.parse(authInfo.token_expire_at) <= Date.now())
    }

    const willExpiredToken = () => {
      return authInfo.token_expire_at && (Date.parse(authInfo.token_expire_at) <= Date.now() + 1000*60*60)
    }

    const refreshToken = async () => {
      const refeshTokenUrl = '/api/auth/refresh_token'
      fetch(refeshTokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': authInfo.token
        },
      })
      .then((response) => {
        if (response.ok) {
          return response.json()
        }

        throw new Error('Something went wrong!')
      })
      .then((tokenInfo) => {
        console.log(tokenInfo)
        saveAuthInfo(tokenInfo)
        return tokenInfo
      })
      .catch(() => {})
    }

    return {
        authInfo,
        login,
        logout,
        signup,
        refreshToken,
        hasBeenExpiredToken,
        willExpiredToken
    }
}

export default useAuth
