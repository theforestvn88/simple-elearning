import React, { useState } from 'react'
import MilestoneForm from './MilestoneForm'
import { useAppContext } from '../../context/AppProvider'
import { Link } from 'react-router-dom'

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

        RequireAuthorizedApi('DELETE', ApiEndPoint)
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

    const MilestoneHeader = () => (
        <div className="d-flex align-items-center justify-content-between">
            <div>{editMilestone.name}</div>
            <div className="d-flex align-items-center justify-content-end">
                {milestone.can_edit && <button
                    type="button"
                    className="btn btn-light"
                    onClick={onEditMilestone}
                    data-testid="edit-milestone">
                    Edit
                </button>}

                {milestone.can_delete && <button
                    type="button"
                    className="btn btn-danger"
                    onClick={onDeleteMilestone}
                    data-testid="delete-milestone">
                    Delete
                </button>}
            </div>
        </div>
    )

    const LessonsList = () => (
        <div>
            {milestone.lessons?.map((lesson) => (
                <div>
                    <Link to={`milestones/${milestone.id}/lessons/${lesson.id}`} key={lesson.id}>
                        {lesson.name}
                    </Link>
                </div>
            ))}
            <div>
            {milestone.can_edit && <Link to={`milestones/${milestone.id}/lessons/new`} className="btn btn-light" data-testid="add-new-lesson">
                    Add Lesson
            </Link>}
            </div>
        </div>
    )

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
                <div>
                    <MilestoneHeader />
                    <LessonsList />
                </div>
            )}
        </>
    )
}

export default Milestone
