import { renderHook, act } from "@testing-library/react"
import useApi from "../../hooks/useApi"
import { fetchMock, getSubmitBodyFromFetchMock } from "../mocks/fetchMock"

describe("useApi Hook", () => {
    it("get", () => {
        const { result } = renderHook(() => useApi())
        act(() => {
            result.current.QueryApi("/api/v1/courses", {page: 1})
        })

        expect(fetchMock).toHaveBeenCalledWith(
            "/api/v1/courses?page=1", 
            {"body": null, "headers": {"Content-Type": "application/json"}, "method": "GET"}
        )
    })

    it("post", () => {
        const { result } = renderHook(() => useApi())
        act(() => {
            result.current.SubmitApi("POST", "/api/v1/post-something", {x: 1, y: 2}, {"X-Auth-Token": "fake-token"})
        })

        expect(fetchMock).toHaveBeenCalledWith(
            "/api/v1/post-something", 
            {"body": "{\"x\":1,\"y\":2}", "headers": {"Content-Type": "application/json", "X-Auth-Token": "fake-token"}, "method": "POST"}
        )
    })

    it("multipart/form-data", () => {
        const { result } = renderHook(() => useApi())
        const formData = new FormData()
        formData.set('x', 1)
        formData.set('y', 2)

        act(() => {
            result.current.SubmitApi("PUT", "/api/v1/upload", formData, {"Content-Type": "multipart/form-data", "X-Auth-Token": "fake-token"})
        })

        expect(fetchMock).toHaveBeenCalledWith(
            "/api/v1/upload", 
            {"body": expect.any(FormData), "headers": {"X-Auth-Token": "fake-token"}, "method": "PUT"}
        )

        const submitedFormData = getSubmitBodyFromFetchMock(fetchMock)
        expect(submitedFormData["x"]).toEqual("1")
        expect(submitedFormData["y"]).toEqual("2")
    })
})
