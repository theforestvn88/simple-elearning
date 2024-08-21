import React from 'react'
import { fireEvent, render, screen, act } from '@testing-library/react'
import { fetchMock, fetchMockReturn, getSubmitBodyFromFetchMock } from '../mocks/fetchMock'
import { localStorageMockReturn } from '../mocks/localStorageMock'

export const LessonFormCommonTests = (view, lesson, expectedSubmitEndpoint, exepctedSubmitMethod) => {
    describe('Lesson Form', () => {
        test('submit', async () => {
            localStorageMockReturn({token: 'xxx', user: { id: 1, name: 'User1' }})
            if (lesson) {
                fetchMockReturn(lesson)
            }
            
            await act( async () => render(view))
    
            fireEvent.change(screen.getByLabelText('Lesson name'), {target: {value: 'updated-name'}})

            await act( async () => {
                fireEvent.submit(screen.getByTestId('submit-lesson-form'))
            })
            
            expect(fetchMock).toHaveBeenCalledWith(
                expectedSubmitEndpoint, 
                {
                    "body": expect.any(FormData),
                    "headers": {"X-Auth-Token": "xxx"}, 
                    "method": exepctedSubmitMethod
                }
            )

            const formData = getSubmitBodyFromFetchMock(fetchMock)
            expect(formData['lesson[name]']).toEqual('updated-name')
        })
    })
}
