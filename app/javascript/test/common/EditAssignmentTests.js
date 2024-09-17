import React from "react"
import { act, fireEvent, render, screen } from "@testing-library/react"
import { MockApiReturn, RequireAuthorizedApiSpy, getSubmitBodyFromApiSpy } from "../mocks/useAppContextMock"

export const EditAssignmentTests = (view, assignmentIndex, assigneeType, assignee, assignableType, assignableId) => {
    it('partner instructors suggestions', async () => {
        await act( async () => render(view))

        MockApiReturn([{id: 1, email: 'prof1@example.com'}])

        await act(async () => {
            fireEvent.click(screen.getAllByRole('button', {name: '+'})[assignmentIndex])
        })

        await act(async () => {
            fireEvent.change(screen.getByLabelText(/Email/i), {target: {value: 'prof1'}})
        })

        expect(screen.getByText('prof1@example.com')).toBeInTheDocument()
    })

    it('submit assignment', async () => {
        await act( async () => render(view))

        MockApiReturn([{id: 2, email: 'prof1@example.com'}])
        
        await act(async () => {
            fireEvent.click(screen.getAllByRole('button', {name: '+'})[assignmentIndex])
        })

        await act(async () => {
            fireEvent.change(screen.getByLabelText(/Email/i), {target: {value: 'prof1'}})
        })
        
        await act(async () => {
            fireEvent.click(screen.getByText('prof1@example.com'))
            fireEvent.submit(screen.getAllByTestId('add-assignment-form')[assignmentIndex])
        })

        expect(RequireAuthorizedApiSpy).toHaveBeenCalledWith(
            "POST", "/api/v1/instructor/meta/assignments", expect.any(FormData)
        )

        const formData = getSubmitBodyFromApiSpy()
        expect(formData['assignment[assignee_type]']).toEqual(assigneeType)
        expect(formData['assignment[assignable_id]']).toEqual(`${assignableId}`)
        expect(formData['assignment[assignable_type]']).toEqual(assignableType)
    })

    it('confirm cancel assignment', async () => {
        await act( async () => render(view))

        MockApiReturn({assignee: {id: 1}})

        await act(async () => {
            fireEvent.click(screen.getAllByRole('button', {name: 'x'})[assignmentIndex])
        })
        await act( async () => {
            fireEvent.click(screen.getAllByRole('button', { name: 'Confirm'})[assignmentIndex])
        })

        expect(RequireAuthorizedApiSpy).toHaveBeenCalledWith(
            "DELETE", "/api/v1/instructor/meta/assignments/cancel", {assignment: {assignee_id: 1, assignable_type: assignableType, assignable_id: assignableId}}
        )

        expect(screen.queryByText(assignee.name)).not.toBeInTheDocument()
    })
}