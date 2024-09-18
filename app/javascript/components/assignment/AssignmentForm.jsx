import React, { useRef } from "react"
import Suggestion from "../Suggestion"
import useApiQuery from "../../hooks/useApiQuery"
import { useAppContext } from "../../context/AppProvider"

const AssignmentForm = ({assignaleType, assignaleId, onSubmitSuccess}) => {
    const { subject, identify, userType, RequireAuthorizedApi } = useAppContext()
    const { setQuery, responseData } = useApiQuery('instructors')
    const selectedInputRef = useRef()
    const assignmentData = new FormData()

    const queryInstructorByEmail = (searchKey) => {
        setQuery({
            partner_slug: identify,
            by_email_or_name: searchKey,
            limit: 5
        })
    }

    const onInstructorSelected = (id) => {
        assignmentData.set('assignment[assignee_id]', id)
    }

    const submit = async (event) => {
        event.preventDefault()

        assignmentData.set('assignment[assignee_type]', userType)
        assignmentData.set('assignment[assignable_type]', assignaleType)
        assignmentData.set('assignment[assignable_id]', assignaleId)

        RequireAuthorizedApi("POST", `/api/v1/${subject}/${identify}/assignments`, assignmentData)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                } else if (response.status == 401) {
                    navigate('/auth/login')
                    return
                }
        
                throw new Error('Something went wrong!')
            })
            .then((response) => {
                selectedInputRef.current.value = ''
                onSubmitSuccess(response)
            })
            .catch((error) => {
                // TODO: handle errors
                console.log(error)
            })
    }

    return (
        <>
            <form onSubmit={submit} data-testid="add-assignment-form">
                <div className="form-group">
                    <label htmlFor="suggestionInput">Email</label>
                    <Suggestion selectedInputRef={selectedInputRef} onQuery={queryInstructorByEmail} queryResult={responseData} textAttribute="email" onSelected={onInstructorSelected} />
                </div>

                <input type="submit" value="Add" className="btn btn-dark mt-3" />
            </form>
        </>
    )
}

export default AssignmentForm
