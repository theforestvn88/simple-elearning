import { renderHook, act } from "@testing-library/react"
import { mockAuth } from "../mocks/useAppContextMock"
import usePermission from "../../hooks/usePermission"

describe('usePermission Hook', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('only admin canCreateInstructor', async () => {
        mockAuth({token: "xxx", user: { id: 1, name: 'User1', rank: 'administrator' }})

        const { result } = renderHook(() => usePermission())
        await act(async () => {
            expect(result.current.canCreateInstructor()).toEqual(true)
        })
    })

    it('users or normal instructor NOT allow to create instructor', async () => {
        mockAuth({token: "xxx", user: { id: 1, name: 'User1', rank: 'professor' }})

        const { result } = renderHook(() => usePermission())
        await act(async () => {
            expect(result.current.canCreateInstructor()).toEqual(false)
        })
    })
})
