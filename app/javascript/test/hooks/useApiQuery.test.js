import { renderHook, act } from "@testing-library/react"
import useApiQuery from "../../hooks/useApiQuery"

const apiCallSpy = jest.fn().mockImplementation(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({}) }))
jest.spyOn(require('../../context/AppProvider'), 'useAppContext').mockReturnValue({
    subject: "user",
    identify: "*",
    RequireAuthorizedApi: apiCallSpy
})

describe("useApiQuery Hook", () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it("call query courses api whenever query updated", async () => {
        const { result } = renderHook(() => useApiQuery('/courses'))

        await act(async () => {
            result.current.setQuery({page: 1})
        })

        expect(apiCallSpy).toHaveBeenCalledWith(
            "GET",
            "/api/v1/user/*/courses", 
            {"page":1}
        )
    })
})
