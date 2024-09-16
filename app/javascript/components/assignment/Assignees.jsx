import React, { useRef } from "react"
import { Link } from "react-router-dom"
import UserAvatar from "../UserAvatar"
import Confirmation from "../Confirmation"
import Modal from "../Modal"
import AssignmentForm from "./AssignmentForm"
import usePathFinder from "../../hooks/usePathFinder"
import { useAppContext } from "../../context/AppProvider"

const Assignees = ({assignees, assignableId, assignableType, can_edit, onAddAssignmentSuccess, onCancelAssignmentSuccess}) => {
    const { RequireAuthorizedApi } = useAppContext()
    const { partnerInstructorProfilePath, cancelAssignmentApiUrl } = usePathFinder()
    const closeModalRef = useRef()
    const addAssignmentModalId = `assignmentModal-${assignableId}-${assignableType}`
    const cancelAssignmentConfirmModalId = (assigneeId) => `cancelAssignment-${assignableId}-${assignableType}-${assigneeId}-Confirm`

    const addAssignmentSuccess =(newAssignment) => {
        closeModalRef.current.click()
        onAddAssignmentSuccess(newAssignment)
    }

    const cancelAssignment = (assigneeId) => {
        RequireAuthorizedApi(
            'DELETE', 
            cancelAssignmentApiUrl, 
            { 
                assignment: { 
                    assignable_id: assignableId,
                    assignable_type: assignableType,
                    assignee_id: assigneeId 
                }
            }
        )
        .then((response) => {
            if (response.ok) {
                return response.json()
            }
            throw new Error('Something went wrong!')
        })
        .then((canceldAssignment) => {
            onCancelAssignmentSuccess(canceldAssignment)
        })
        .catch((error) => console.log(error))
    }

    return (
        <>
            <div className="d-flex align-items-center justify-content-start">
                {can_edit && (
                    <button data-bs-toggle="modal" data-bs-target={`#${addAssignmentModalId}`} className="mx-3 btn btn-secondary">
                        +
                    </button>
                )}
                <div>
                    {assignees && assignees.map((assignee) => (
                        <div key={assignee.id} className="me-3 btn-group" role="group">
                            <Link to={partnerInstructorProfilePath(assignee)} className="btn btn-light" type="button">
                                <UserAvatar user={assignee} size={20} showName={true} />
                            </Link>
                            {can_edit && 
                                <button data-bs-toggle="modal" data-bs-target={`#${cancelAssignmentConfirmModalId(assignee.id)}`} className="btn btn-light" type="button">
                                    x
                                </button>
                            }
                            {can_edit &&
                                <Confirmation 
                                    id={cancelAssignmentConfirmModalId(assignee.id)} 
                                    title={`Delete assignment from ${assignableType}[${assignableId}]`}
                                    description="Are you sure ?"
                                    onConfirm={() => cancelAssignment(assignee.id)}
                                />
                            }
                        </div>   
                    ))}
                </div>
            </div>
            {can_edit && 
                <Modal
                    id={addAssignmentModalId}
                    title={`Add assignment to ${assignableType}[${assignableId}]`}
                    closeModalRef={closeModalRef}>
                    <AssignmentForm assignaleType={assignableType} assignaleId={assignableId} onSubmitSuccess={addAssignmentSuccess} />
                </Modal>
            }
        </>
    )
}

export default Assignees
