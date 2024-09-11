import React, { act } from "react"
import { fetchMock, fetchMockReturn } from "../mocks/fetchMock"
import { cleanup, fireEvent, screen, render } from "@testing-library/react"
import { MockApiReturn, RequireAuthorizedApiSpy, mockAuth } from "../mocks/useAppContextMock"

const FakePagination = { pages: ['1', '2', 'gap', '3', '4'], total: 10 }

export const PaginationTests = (view, queryPath, requiredAuthorized = true) => {
    describe('pagination', () => {
        beforeEach(() => {
            if (requiredAuthorized) {
                mockAuth({token: 'xxx', user: { name: 'Instructor 1' }})
                MockApiReturn({ loading: false, pagination: FakePagination })
            } else {
                fetchMock.mockClear()
                fetchMock.mockRestore()
                fetchMockReturn({pagination: FakePagination })
            }
            
            cleanup()
        })

        afterEach(() => {
            jest.clearAllMocks()
            jest.restoreAllMocks()
        })

        it('show pagination pages', async () => {
            await act( async () => render(view))

            for(let page = 1; page <= 4; page++) {
                expect(screen.getByRole('button', {name: page})).toBeInTheDocument()
            }
            expect(screen.getByRole('button', {name: 'First'})).toBeInTheDocument()
            expect(screen.getByRole('button', {name: 'Last'})).toBeInTheDocument()
            expect(screen.getByRole('button', {name: 2})).toBeInTheDocument()
        })

        it('click on normal page should start loading that page', async () => {
            await act( async () => render(view))

            await act( async () => {
                fireEvent.click(screen.getByRole('button', {name: 2}))
            })

            if (requiredAuthorized) {
                expect(RequireAuthorizedApiSpy).toHaveBeenCalledWith(
                    "GET", `/api/v1/${queryPath}`, {"page": "2"}
                )
            } else {
                expect(fetchMock).toHaveBeenCalledWith(
                    `/api/v1/${queryPath}?page=2`, 
                    {"body": null, "headers": {"Content-Type": "application/json"}, "method": "GET"}
                )
            }
        })

        it('click on the last page should start loading the last page', async () => {
            await act( async () => render(view))

            await act( async () => {
                fireEvent.click(screen.getByRole('button', {name: 'Last'}))
            })
            
            if (requiredAuthorized) {
                expect(RequireAuthorizedApiSpy).toHaveBeenCalledWith(
                    "GET", `/api/v1/${queryPath}`, {"page": "10"}
                )
            } else {
                expect(fetchMock).toHaveBeenCalledWith(
                    `/api/v1/${queryPath}?page=10`, 
                    {"body": null, "headers": {"Content-Type": "application/json"}, "method": "GET"}
                )
            }
        })

        it('click on the first page should start loading the first page', async () => {
            await act( async () => render(view))

            await act( async () => {
                fireEvent.click(screen.getByRole('button', {name: 'First'}))
            })
            
            if (requiredAuthorized) {
                expect(RequireAuthorizedApiSpy).toHaveBeenCalledWith(
                    "GET", `/api/v1/${queryPath}`, {"page": "1"}
                )
            } else {
                expect(fetchMock).toHaveBeenCalledWith(
                    `/api/v1/${queryPath}?page=1`, 
                    {"body": null, "headers": {"Content-Type": "application/json"}, "method": "GET"}
                )
            }
        })

        it('not show pagination when total page is <= 1', async () => {
            FakePagination.total = 1
            
            await act( async () => render(view))
            expect(screen.queryByTestId('pagination')).not.toBeInTheDocument()
            
            FakePagination.total = 10
        })
    })
}
