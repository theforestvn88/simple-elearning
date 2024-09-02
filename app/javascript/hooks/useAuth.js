import { useCallback, useState } from "react"
import useApi from "./useApi"

const AuthCacheKey = 'open-courses-auth'

const useAuth = (subject, identify) => {
    const Domain = `${subject}/${identify}`
    const DomainAuthCacheKey = `${AuthCacheKey}/${Domain}`

    const { QueryApi, SubmitApi } = useApi()
    const [authInfo, setAuthInfo] = useState(JSON.parse(localStorage.getItem(DomainAuthCacheKey) || '{}'))
    
    const saveAuthInfo = (newAuthInfo) => {
      const mergeAuthInfo = {
        ...authInfo,
        token: newAuthInfo.token || authInfo.token,
        token_expire_at: newAuthInfo.token_expire_at || authInfo.token_expire_at,
        user: newAuthInfo.user || authInfo.user
      }

      localStorage.setItem(DomainAuthCacheKey, JSON.stringify(mergeAuthInfo))
      setAuthInfo(JSON.parse(localStorage.getItem(DomainAuthCacheKey)))
    }

    const saveUserInfo = (userInfo) => {
      if (userInfo) {
        saveAuthInfo({
          user: {
            ...authInfo.user,
            id: userInfo.id || authInfo.user?.id,
            name: userInfo.name || authInfo.user?.name,
            avatar: {
              url: userInfo.avatar?.url || authInfo.user?.avatar?.url
            }
          }
        })
      }
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

    const clearAuth = useCallback(() => {
      localStorage.removeItem(DomainAuthCacheKey)
      setAuthInfo({})
    }, [])

    const RequireAuthorizedApi = useCallback(async (method, path, params = {}, headers = {}) => {
      const authHeaders = { ...headers, 'X-Auth-Token': authInfo.token }

      return (method === 'GET' ? QueryApi(path, params, authHeaders) : SubmitApi(method, path, params, authHeaders))
        .then((response) => {
          if (response.status == 401) { // handle unauthorized
            clearAuth()
          }
          return response
        })
    }, [authInfo])

    const login = useCallback(async (loginParams) => {
      return handleAuthSuccess(
        SubmitApi('POST', `/api/auth/${Domain}/login`, loginParams)
      )
    }, [])
    
    const logout = useCallback(async () => {
      return RequireAuthorizedApi('DELETE', `/api/auth/${Domain}/logout`)
        .then((response) => {
          if (isSuccess(response.status)) {
            clearAuth()
            return response
          }

          throw new Error('Something went wrong!')
        })
    }, [authInfo])

    const signup = useCallback(async (signupParams) => {
      return handleAuthSuccess(
        SubmitApi('POST', `/api/auth/${Domain}/signup`, signupParams)
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
        RequireAuthorizedApi('POST', `/api/auth/${Domain}/refresh_token`)
      )
    }, [authInfo])
    
    const changePassword = useCallback(async (params) => {
      return RequireAuthorizedApi('PUT', `/api/auth/${Domain}/password/update`, params)
        .then((response) => {
          if (response.ok) {
            clearAuth()
            return response
          }

          throw new Error('Something went wrong!')
        })
    }, [authInfo])

    return {
        authInfo,
        saveUserInfo,
        login,
        logout,
        signup,
        refreshToken,
        hasBeenExpiredToken,
        willExpiredToken,
        clearAuth,
        changePassword,
        RequireAuthorizedApi
    }
}

export default useAuth
