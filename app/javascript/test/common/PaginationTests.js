import React, { act } from "react"
import { fetchMock, fetchMockReturn } from "../mocks/fetchMock"
import { cleanup, fireEvent, screen, render } from "@testing-library/react"

const FakePagination = { pages: ['1', '2', 'gap', '3', '4'], total: 10 }

export const PaginationTests = (view, queryPath) => {
    describe('pagination', () => {
        beforeEach(() => {
            fetchMock.mockClear()
            fetchMock.mockRestore()
            fetchMockReturn({pagination: FakePagination })
            
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
        })

        it('click on normal page should start loading that page courses', async () => {
            await act( async () => render(view))

            await act( async () => {
                fireEvent.click(screen.getByRole('button', {name: 2}))
            })

            expect(fetchMock).toHaveBeenCalledWith(
                `/api/v1/instructor/meta${queryPath}?page=2`, 
                {"body": null, "headers": {"Content-Type": "application/json"}, "method": "GET"}
            )
        })

        it('click on the last page should start loading the last page courses', async () => {
            await act( async () => render(view))

            await act( async () => {
                fireEvent.click(screen.getByRole('button', {name: 'Last'}))
            })
    
            expect(fetchMock).toHaveBeenCalledWith(
                `/api/v1/instructor/meta${queryPath}?page=10`, 
                {"body": null, "headers": {"Content-Type": "application/json"}, "method": "GET"}
            )
        })

        it('click on the first page should start loading the first page courses', async () => {
            await act( async () => render(view))

            await act( async () => {
                fireEvent.click(screen.getByRole('button', {name: 'First'}))
            })
    
            expect(fetchMock).toHaveBeenCalledWith(
                `/api/v1/instructor/meta${queryPath}?page=1`, 
                {"body": null, "headers": {"Content-Type": "application/json"}, "method": "GET"}
            )
        })

        it('not show pagination when total page is <= 1', async () => {
            FakePagination.total = 1
            
            await act( async () => render(view))
            expect(screen.queryByTestId('pagination')).not.toBeInTheDocument()
            
            FakePagination.total = 10
        })
    })
}
