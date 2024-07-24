import React from 'react'
import { fireEvent, render, screen, act } from '@testing-library/react'
import { fetchMock, fetchMockReturn, getSubmitBodyFromFetchMock } from '../mocks/fetchMock'
import { localStorageMockReturn } from '../mocks/localStorageMock'
import flushPromises from '../helper/flushPromises'
import { RailsActiveStorageDirectUploadSpy, DirectUploadMockReturn } from '../mocks/useUploaderMock'

export const CourseFormCommonTests = (view, course, expectedSubmitEndpoint, exepctedSubmitMethod) => {
    describe('Course Form', () => {
        test('submit', async () => {
            localStorageMockReturn({token: 'xxx', user: { id: 1, name: 'User1' }})
            if (course) {
                fetchMockReturn(course)
            }
            
            await act( async () => render(view))
    
            fireEvent.change(screen.getByLabelText('Course name'), {target: {value: 'updated-name'}})

            const fakeSignedId = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            DirectUploadMockReturn({signed_id: fakeSignedId})

            const fakeFile = new File(['(⌐□_□)'], 'chucknorris.png', {type: 'image/png'})
            await act( async () => {
                fireEvent.drop(document.querySelector('#courseCover'), {
                    dataTransfer: {
                        files: [fakeFile],
                    },
                })
            })

            await flushPromises()
            expect(RailsActiveStorageDirectUploadSpy).toHaveBeenCalled()

            await act( async () => {
                fireEvent.submit(screen.getByTestId('submit-course-form'))
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
            expect(formData['course[name]']).toEqual('updated-name')
            expect(formData['course[cover]']).toEqual(fakeSignedId)
        })
    })
}
