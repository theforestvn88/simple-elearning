import { renderHook, act } from "@testing-library/react"
import useAuth from "../../hooks/useAuth"
import { fetchMock, fetchMockReturn } from "../mocks/fetchMock"
import { localStorageMockReturn, localStorageRemoveItemSpy, localStorageSetItemSpy } from "../mocks/localStorageMock"
import flushPromises from "../helper/flushPromises"

describe("useAuth Hook", () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it("login", async () => {
        const loginParams = { email: "tester@example.com", password: "******"}
        const localStorageSpy = localStorageSetItemSpy()
        const fakeResponse = {token: "xxx", user: { id: 1, name: 'User1' }}
        fetchMockReturn(fakeResponse)

        const { result } = renderHook(() => useAuth())
        await act(async () => {
            await result.current.login(loginParams)
        })

        expect(fetchMock).toHaveBeenCalledWith(
            "/api/auth/login", 
            {
                "method": "POST",
                "headers": {"Content-Type": "application/json"}, 
                "body": "{\"email\":\"tester@example.com\",\"password\":\"******\"}"
            }
        )

        // should save response to localstorage
        await flushPromises()
        expect(localStorageSpy).toHaveBeenCalled()
        expect(JSON.parse(localStorageSpy.mock.lastCall[1])).toEqual(fakeResponse)
    })

    it("logout", async () => {
        fetchMockReturn({})
        localStorageMockReturn({token: "xxx", user: { id: 1, name: 'User1' }})

        const { result } = renderHook(() => useAuth())
        await act(async () => {
            await result.current.logout()
        })

        expect(fetchMock).toHaveBeenCalledWith(
            "/api/auth/logout", 
            {
                "method": "DELETE",
                "headers": {"Content-Type": "application/json", "X-Auth-Token": "xxx"}, 
                "body": "{}"
            }
        )
    })

    it("logout user with expired token", async () => {
        const clearStorageSpy = localStorageRemoveItemSpy()
        localStorageMockReturn({token: "xxx", user: { id: 1, name: 'User1' }})

        fetchMockReturn(401, {message: 'unauthrorized'})

        const { result } = renderHook(() => useAuth())
        await act(async () => {
            await result.current.logout()
        })

        await flushPromises()

        // should delete auth from local-storage
        expect(clearStorageSpy).toHaveBeenCalled()
    })

    it("refreshToken", async () => {
        const localStorageSpy = localStorageSetItemSpy()
        const fakeCache = {token: "xxx", token_expire_at: 'xx/xx/xx', user: { id: 1, name: 'User1' }}
        localStorageMockReturn(fakeCache)

        const fakeResponse = {token: "yyy", token_expire_at: 'yy/yy/yy'}
        fetchMockReturn(fakeResponse)

        const { result } = renderHook(() => useAuth())
        await act(async () => {
            await result.current.refreshToken()
        })

        expect(fetchMock).toHaveBeenCalledWith(
            "/api/auth/refresh_token", 
            {
                "method": "POST",
                "headers": {"Content-Type": "application/json", "X-Auth-Token": "xxx"}, 
                "body": "{}"
            }
        )

        await flushPromises()
        expect(localStorageSpy).toHaveBeenCalled()
        expect(JSON.parse(localStorageSpy.mock.lastCall[1])).toEqual({...fakeCache, ...fakeResponse})
    })

    it("signup", async () => {
        const localStorageSpy = localStorageSetItemSpy()
        localStorageMockReturn({})

        const fakeResponse = {token: "yyy", token_expire_at: 'yy/yy/yy', user: { id: 1, name: 'User1' }}
        fetchMockReturn(fakeResponse)

        const { result } = renderHook(() => useAuth())
        await act(async () => {
            await result.current.signup({email: "tester@example.com", password: "1111111111", password_confirmation: "1111111111", name: "tester"})
        })

        expect(fetchMock).toHaveBeenCalledWith(
            '/api/auth/signup', 
            {
                "body": "{\"email\":\"tester@example.com\",\"password\":\"1111111111\",\"password_confirmation\":\"1111111111\",\"name\":\"tester\"}",
                "headers": {"Content-Type": "application/json"}, 
                "method": "POST"
            }
        )

        await flushPromises()
        expect(localStorageSpy).toHaveBeenCalled()
        expect(JSON.parse(localStorageSpy.mock.lastCall[1])).toEqual(fakeResponse)
    })

    it("change password", async () => {
        const clearStorageSpy = localStorageRemoveItemSpy()
        localStorageMockReturn({token: "xxx", user: { id: 1, name: 'User1' }})

        fetchMockReturn({})

        const { result } = renderHook(() => useAuth())
        await act(async () => {
            await result.current.changePassword({password_challenge: "xxxxxx", password: "1111111111", password_confirmation: "1111111111"})
        })

        expect(fetchMock).toHaveBeenCalledWith(
            '/api/auth/password/update', 
            {
                "body": "{\"password_challenge\":\"xxxxxx\",\"password\":\"1111111111\",\"password_confirmation\":\"1111111111\"}",
                "headers": {
                    "Content-Type": "application/json",
                    "X-Auth-Token": "xxx",
                }, 
                "method": "PUT"
            }
        )
        
        await flushPromises()
        expect(clearStorageSpy).toHaveBeenCalled()
    })
})
