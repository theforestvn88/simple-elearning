export const loginSpy = jest.fn().mockImplementation(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({}) }))
export const logoutSpy = jest.fn().mockImplementation(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({}) }))
export const refreshTokenSpy = jest.fn().mockImplementation(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({}) }))
export const signupSpy = jest.fn().mockImplementation(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({}) }))
export const changePasswordSpy = jest.fn().mockImplementation(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({}) }))

export const mockAuth = (authInfo) => {
    jest.spyOn(require('../../context/AppProvider'), 'useAppContext').mockReturnValue({
        auth: {
            info: authInfo,
            login: loginSpy,
            logout: logoutSpy,
            refreshToken: refreshTokenSpy,
            signup: signupSpy,
            changePassword: changePasswordSpy
        }
    })
}

mockAuth({})
