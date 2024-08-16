import React, { useState, useEffect } from 'react'
import MilestoneForm from './MilestoneForm'
import { useAppContext } from '../../context/AppProvider'

const Milestone = ({courseId, milestone, onUpdateSuccess, onDeleteSuccess}) => {
    const {subject, identify, RequireAuthorizedApi} = useAppContext()
    const ApiEndPoint = `/api/v1/${subject}/${identify}/courses/${courseId}/milestones/${milestone.id}`
    const [editMilestone, setEditMilestone] = useState({...milestone, edit: false})

    const onEditMilestone = (event) => {
        event.preventDefault()

        setEditMilestone({...editMilestone, edit: true})
    }

    const onUpdateMilestoneSuccess = (updatedMilestone) => {
        setEditMilestone({...updatedMilestone, edit: false})
        if (onUpdateSuccess) {
            onUpdateSuccess(updatedMilestone)
        }
    }

    const onDeleteMilestone = (event) => {
        event.preventDefault()

        RequireAuthorizedApi('DELETE', ApiEndPoint, {}, {})
            .then((response) => {
                if (response.ok) {
                    if (onDeleteSuccess) {
                        onDeleteSuccess(editMilestone)
                    }
                }
                throw new Error('Something went wrong!')
            })
            .catch((error) => console.log(error))
    }

    return (
        <>
            {editMilestone.edit ? (
                <MilestoneForm 
                    milestone={editMilestone}
                    submitMethod={'PUT'}
                    submitEndpoint={ApiEndPoint}
                    onSubmitSuccess={onUpdateMilestoneSuccess} 
                    onSubmitError={() => {}}
                />
            ) : (
                <div className="d-flex align-items-center justify-content-between">
                    <div>{editMilestone.name}</div>
                    <div className="d-flex align-items-center justify-content-end">
                        <button
                            type="button"
                            className="btn btn-light"
                            onClick={onEditMilestone}
                        >
                            Edit
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={onDeleteMilestone}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default Milestone
