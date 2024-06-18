import React from 'react'
import { render, screen } from '@testing-library/react'
import App from '../../components/App'

describe('App', () => {
    it('should have link to courses list', () => {
        render(<App />)

        expect(screen.getByRole('link', { to: '/courses' })).toBeInTheDocument()
    })
})
