import { renderHook } from "@testing-library/react"
import react_router from 'react-router-dom'
import usePathFinder from "../../hooks/usePathFinder"

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(),
}))

describe('usePathFinder', () => {
    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('after instructor auth success should back to the base path', () => {
        jest.spyOn(react_router, "useLocation").mockReturnValue({ pathname: '/partners/partner-zero/auth/login' })

        const { result } = renderHook(() => usePathFinder())

        expect(result.current.authSuccessPath).toEqual('/partners/partner-zero')
    })

    it('after user auth success should back to the base path', () => {
        jest.spyOn(react_router, "useLocation").mockReturnValue({ pathname: '/auth/login' })

        const { result } = renderHook(() => usePathFinder())

        expect(result.current.authSuccessPath).toEqual('/')
    })
})
