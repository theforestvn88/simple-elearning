import { useCallback, useState } from "react"
import useApi from "./useApi"

const AuthCacheKey = 'open-courses-auth'

const useAuth = () => {
    const { BaseApi } = useApi()
    const [authInfo, setAuthInfo] = useState(JSON.parse(localStorage.getItem(AuthCacheKey) || '{}'))
    
    const saveAuthInfo = (newAuthInfo) => {
      const mergeAuthInfo = {
        ...authInfo,
        token: newAuthInfo.token || authInfo.token,
        token_expire_at: newAuthInfo.token_expire_at || authInfo.token_expire_at,
        user: newAuthInfo.user || authInfo.user
      }

      localStorage.setItem(AuthCacheKey, JSON.stringify(mergeAuthInfo))
      setAuthInfo(JSON.parse(localStorage.getItem(AuthCacheKey)))
    }

    const isSuccess = (status) => status >= 200 && status <= 299
    const handleAuthSuccess = (authPromise) => {
      return authPromise.then((response) => {
        if (isSuccess(response.status)) {
          return response.json()
        }

        throw new Error('Something went wrong!')
      })
      .then((data) => {
        saveAuthInfo(data)
        return data
      })
    }

    const RequireAuthorizedApi = async (method, path, headers, params) => {
      return BaseApi(method, path, { ...headers, 'X-Auth-Token': authInfo.token }, params)
        .then((response) => {
          if (response.status == 401) { // handle unauthorized
            localStorage.removeItem(AuthCacheKey)
            setAuthInfo({})
          }
          return response
        })
    }

    const login = useCallback(async (loginParams) => {
      return handleAuthSuccess(
        BaseApi('POST', '/api/auth/login', {}, loginParams)
      )
    }, [])
    
    const logout = useCallback(async () => {
      return RequireAuthorizedApi('DELETE', '/api/auth/logout', {}, {})
        .then((response) => {
          if (isSuccess(response.status)) {
            localStorage.removeItem(AuthCacheKey)
            setAuthInfo({})
            return response.json()
          }

          throw new Error('Something went wrong!')
        })
    }, [])

    const clearAuth = useCallback(() => {
      localStorage.removeItem(AuthCacheKey)
      setAuthInfo({})
    }, [])

    const signup = useCallback(async (signupParams) => {
      return handleAuthSuccess(
        BaseApi('POST', '/api/auth/signup', {}, signupParams)
      )
    }, [])

    const hasBeenExpiredToken = () => {
      return authInfo.token_expire_at && (Date.parse(authInfo.token_expire_at) <= Date.now())
    }

    const willExpiredToken = () => {
      return authInfo.token_expire_at && (Date.parse(authInfo.token_expire_at) <= Date.now() + 1000*60*60)
    }

    const refreshToken = useCallback(async () => {
      return handleAuthSuccess(
        RequireAuthorizedApi('POST', '/api/auth/refresh_token', {}, {})
      )
    }, [])

    return {
        authInfo,
        login,
        logout,
        signup,
        refreshToken,
        hasBeenExpiredToken,
        willExpiredToken,
        clearAuth,
        RequireAuthorizedApi
    }
}

export default useAuth
