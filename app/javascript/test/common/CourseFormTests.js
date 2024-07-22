import React, { act } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import react_router, { MemoryRouter } from 'react-router-dom'
import { fakeCourses } from '../mocks/fakeCourses'
import { fetchMock, fetchMockReturn, getSubmitBodyFromFetchMock } from '../mocks/fetchMock'
import AppProvider from '../../context/AppProvider'
import { localStorageMockReturn } from '../mocks/localStorageMock'
import * as RailsActiveStorage from "@rails/activestorage"
import flushPromises from '../helper/flushPromises'

jest.mock('@rails/activestorage', () => ({
    ...jest.requireActual('@rails/activestorage'),
    DirectUpload: jest.fn(),
}))

const DirectUploadSpy = jest.spyOn(RailsActiveStorage, 'DirectUpload')

const DirectUploadMockReturn = (blob) => DirectUploadSpy.mockImplementation(() => {
    return {
        create: jest.fn().mockImplementation((callback) => {
            callback(null, blob)
        })
    }
})

export const CourseFormCommonTests = (container, expectedSubmitEndpoint, exepctedSubmitMethod) => {
    describe('Course Form', () => {
        test('submit', async () => {
            localStorageMockReturn({token: 'xxx', user: { id: 1, name: 'User1' }})
            fetchMockReturn(fakeCourses[0])
    
            await act( async () => render(<MemoryRouter><AppProvider>{container}</AppProvider></MemoryRouter>))
    
            fetchMock.mockRestore()
            fetchMockReturn(fakeCourses[0])
    
            fireEvent.change(screen.getByLabelText('Course name'), {target: {value: 'updated-name'}})

            const fakeSignedId = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            DirectUploadMockReturn({signed_id: fakeSignedId})

            fireEvent.drop(document.querySelector('#courseCover'), {
                dataTransfer: {
                  files: [new File(['(⌐□_□)'], 'chucknorris.png', {type: 'image/png'})],
                },
            })
            
            await flushPromises()
            expect(DirectUploadSpy).toHaveBeenCalled()

            fireEvent.submit(screen.getByTestId('submit-course-form'))
            
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
