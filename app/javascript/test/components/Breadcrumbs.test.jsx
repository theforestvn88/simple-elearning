import React from 'react'
import { render, screen } from '@testing-library/react'
import Breadcrumbs from '../../components/Breadcrumbs'
import react_router, { MemoryRouter, useLocation } from 'react-router-dom'

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(),
}))

describe('Breadcrumbs', () => {
    beforeEach(() => {
        jest.spyOn(react_router, "useLocation").mockReturnValue({ pathname: '/courses/1/edit' })
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('should have links for parts of the current path', () => {
        render(<MemoryRouter><Breadcrumbs /></MemoryRouter>)

        expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
        expect(screen.getByRole('link', { name: 'Courses' })).toHaveAttribute('href', '/courses')
        expect(screen.getByRole('link', { name: '1' })).toHaveAttribute('href', '/courses/1')
        expect(screen.getByText(/Edit/)).toBeInTheDocument()
    })
})
