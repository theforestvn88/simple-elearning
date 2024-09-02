import { renderHook, act } from "@testing-library/react"
import useCoursesQuery from "../../hooks/useCoursesQuery"

const apiCallSpy = jest.fn().mockImplementation(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({}) }))
jest.spyOn(require('../../context/AppProvider'), 'useAppContext').mockReturnValue({
    subject: "user",
    identify: "*",
    RequireAuthorizedApi: apiCallSpy
})

describe("useCoursesQuery Hook", () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it("call query courses api whenever query updated", async () => {
        const { result } = renderHook(() => useCoursesQuery())

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
