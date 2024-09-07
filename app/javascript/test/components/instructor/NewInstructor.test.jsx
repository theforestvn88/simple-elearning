import React from 'react'
import { fireEvent, render, screen, act } from '@testing-library/react'
import { fetchMock, fetchMockReturn, getSubmitBodyFromFetchMock } from '../../mocks/fetchMock'
import { MemoryRouter } from 'react-router-dom'
import AppProvider from '../../../context/AppProvider'
import NewInstructor from '../../../components/instructor/NewInstructor'
import { localStorageMockReturn } from '../../mocks/localStorageMock'

describe('Add New Instructor', () => {
    test('submit', async () => {
        localStorageMockReturn({token: 'xxx'})
        fetchMockReturn({id: 1})
        
        await act( async () => render(<MemoryRouter><AppProvider subject='instructor' identify='meta'><NewInstructor /></AppProvider></MemoryRouter>))

        fireEvent.change(screen.getByLabelText('Email'), {target: {value: 'ins1@example.com'}})
        fireEvent.change(screen.getByLabelText('Name'), {target: {value: 'Instructor1'}})
        fireEvent.change(screen.getByLabelText('Rank'), {target: {value: 'Lecturer'}})

        await act( async () => {
            fireEvent.submit(screen.getByTestId('create-instructor-form'))
        })
        
        expect(fetchMock).toHaveBeenCalledWith(
            '/api/v1/instructors', 
            {
                "body": expect.any(FormData),
                "headers": {"X-Auth-Token": "xxx"}, 
                "method": "POST"
            }
        )

        const formData = getSubmitBodyFromFetchMock(fetchMock)
        expect(formData['instructor[email]']).toEqual('ins1@example.com')
        expect(formData['instructor[name]']).toEqual('Instructor1')
        expect(formData['instructor[rank]']).toEqual('Lecturer')
    })
})
