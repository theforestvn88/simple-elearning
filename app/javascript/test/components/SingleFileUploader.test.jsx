import React, { act } from 'react'
import { render, screen } from '@testing-library/react'
import SingleFileUploader from '../../components/SingleFileUploader'
import { MemoryRouter } from 'react-router-dom'
import AppProvider from '../../context/AppProvider'

describe('SingleFileUploader', () => {
    it('show upload info', async () => {
        await act( async () => render(
            <MemoryRouter>
                <AppProvider>
                <SingleFileUploader
                    id="test-dropzone-uploader"
                    acceptedFiles="image/jpeg,image/png"
                    maxFilesize={2000}
                />
                </AppProvider>
            </MemoryRouter>
        ))

        expect(screen.getByText(/Drop file here to upload or click here to browse/i)).toBeInTheDocument()
        expect(screen.getByText(/2.0 MB file size maximum. Allowed file types: image\/jpeg,image\/png/i)).toBeInTheDocument()
    })
})
