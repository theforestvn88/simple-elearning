export const loginSpy = jest.fn().mockImplementation(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({}) }))
export const logoutSpy = jest.fn().mockImplementation(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({}) }))
export const refreshTokenSpy = jest.fn().mockImplementation(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({}) }))
export const signupSpy = jest.fn().mockImplementation(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({}) }))
export const changePasswordSpy = jest.fn().mockImplementation(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({}) }))
export const clearAuthSpy = jest.fn().mockImplementation(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({}) }))
export const willExpiredTokenSpy = jest.fn().mockImplementation(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({}) }))
export const RequireAuthorizedApiSpy = jest.fn().mockImplementation(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({}) }))
export const MockApiReturn = (res) => {
    RequireAuthorizedApiSpy.mockClear()
    RequireAuthorizedApiSpy.mockRestore()
    RequireAuthorizedApiSpy.mockImplementation(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(res) }))
}
export const getSubmitBodyFromApiSpy = () => {
    return Array.from(RequireAuthorizedApiSpy.mock.lastCall[2].entries())
          .reduce((acc, f) => ({ ...acc, [f[0]]: f[1] }), {})
}

export const mockAuth = (authInfo, subject = 'subject', identify = 'identify', userType = 'instructor') => {
    jest.spyOn(require('../../context/AppProvider'), 'useAppContext').mockReturnValue({
        subject,
        identify,
        userType,
        auth: {
            info: authInfo,
            login: loginSpy,
            logout: logoutSpy,
            refreshToken: refreshTokenSpy,
            signup: signupSpy,
            changePassword: changePasswordSpy,
            willExpiredToken: willExpiredTokenSpy
        },
        clearAuth: clearAuthSpy,
        RequireAuthorizedApi: RequireAuthorizedApiSpy
    })
}
