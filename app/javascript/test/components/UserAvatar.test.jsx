import React from 'react'
import { render, screen } from '@testing-library/react'
import UserAvatar from '../../components/UserAvatar'
import { MemoryRouter } from 'react-router-dom'

describe('UserAvatar', () => {
    it('show default avatar if user not setup', () => {
        render(<MemoryRouter><UserAvatar user={{}} /></MemoryRouter>)
        expect(screen.getByTestId('default-user-avatar')).toBeInTheDocument()
    })

    it('show user updated avatar', () => {
        render(<MemoryRouter><UserAvatar user={{avatar: {url: 'avatar-url'}}} /></MemoryRouter>)
        expect(screen.getByRole('img', {src: 'avatar-url'})).toBeInTheDocument()
    })
})
