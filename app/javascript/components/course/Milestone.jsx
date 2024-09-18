import React, { useState } from 'react'
import MilestoneForm from './MilestoneForm'
import { useAppContext } from '../../context/AppProvider'
import { Link } from 'react-router-dom'
import Collapse from '../Collapse'
import Assignees from '../assignment/Assignees'
import usePathFinder from '../../hooks/usePathFinder'

const Milestone = ({courseId, milestone, onUpdateSuccess, onDeleteSuccess}) => {
    const { RequireAuthorizedApi } = useAppContext()
    const { milestoneApiUrl } = usePathFinder()
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

        RequireAuthorizedApi('DELETE', milestoneApiUrl(courseId, milestone.id))
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

    const onAddAssignmentSuccess = (newAssignment) => {
        setEditMilestone({
            ...editMilestone,
            assignees: editMilestone.assignees.concat(newAssignment.assignee)
        })
    }

    const onCancelAssignmentSuccess = (canceledAssignment) => {
        setEditMilestone({
            ...editMilestone,
            assignees: editMilestone.assignees.filter((assignee) => assignee.id != canceledAssignment.assignee.id)
        })
    }

    const MilestoneHeader = () => (
        <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center justify-content-start">
                <h6>{`#${editMilestone.position}`}</h6>
                <h6 className="btn btn-link">{editMilestone.name}</h6>
            </div>
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
        <div className="ms-3">
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Lesson</th>
                        <th scope="col">Assignees</th>
                    </tr>
                </thead>
                <tbody>
                    {milestone.lessons?.map((lesson) => (
                        <tr key={lesson.id} className="mb-3">
                            <th scope="row">{lesson.position}</th>
                            <td>
                                <Link to={`milestones/${milestone.id}/lessons/${lesson.id}`}>{lesson.name}</Link>
                            </td>
                            <td>
                                <Assignees
                                    assignees={lesson.assignees} 
                                    can_edit={false}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                {milestone.can_edit && <Link to={`milestones/${milestone.id}/lessons/new`} className="btn btn-light mt-2" data-testid="add-new-lesson">
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
                    submitEndpoint={milestoneApiUrl(courseId, milestone.id)}
                    onSubmitSuccess={onUpdateMilestoneSuccess} 
                    onSubmitError={() => {}}
                />
            ) : (
                <Collapse>
                    <MilestoneHeader />
                    <div>
                        <div className="mb-3 d-flex justify-content-start">
                            <span>Assignees:</span>
                            <Assignees
                                assignees={editMilestone.assignees} 
                                can_edit={editMilestone.can_edit} 
                                assignableId={editMilestone.id} assignableType="Milestone"
                                onAddAssignmentSuccess={onAddAssignmentSuccess}
                                onCancelAssignmentSuccess={onCancelAssignmentSuccess}
                            />
                        </div>
                        <LessonsList />
                    </div>
                </Collapse>
            )}
        </>
    )
}

export default Milestone
