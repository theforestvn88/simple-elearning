import React, { useState, useEffect, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import MilestoneForm from './MilestoneForm'
import { useAppContext } from '../../context/AppProvider'
import Milestone from './Milestone'
import Modal from '../Modal'
import AssignmentForm from '../assignment/AssignmentForm'
import UserAvatar from '../UserAvatar'
import Confirmation from '../Confirmation'

const CourseDetail = () => {
    const navigate = useNavigate()
    const params = useParams()
    const {subject, identify, RequireAuthorizedApi} = useAppContext()

    const [course, setCourse] = useState({})
    const [showMilestoneForm, setShowMilestoneForm] = useState(false)
    const closeModalRef = useRef()

    useEffect(() => {
        const courseUrl = `/api/v1/${subject}/${identify}/courses/${params.id}`
        RequireAuthorizedApi('GET', courseUrl)
            .then((res) => {
                if (res.ok) {
                    return res.json()
                }

                throw new Error('Something went wrong!')
            })
            .then((course) => setCourse(course))
            .catch(() => {})
    }, [params.id])

    const onDeleteCourse = (event) => {
        event.preventDefault()

        const deleteCourseUrl = `/api/v1/${subject}/${identify}/courses/${course.id}`

        RequireAuthorizedApi('DELETE', deleteCourseUrl)
            .then((response) => {
                if (response.ok) {
                    navigate('/courses')
                }
                throw new Error('Something went wrong!')
            })
            .catch((error) => console.log(error))
    }

    const addNewMileStone = (event) => {
        event.preventDefault()

        setShowMilestoneForm(true)
    }

    const onAddNewMilestoneSuccess = (newMilestone) => {
        setCourse({
            ...course,
            milestones: [...course.milestones, newMilestone]
        })
        setShowMilestoneForm(false)
    }

    const onDeleteMilestoneSuccess = (deletedMilestone) => {
        setCourse({
            ...course,
            milestones: course.milestones.filter((ms) => ms.id != deletedMilestone.id)
        })
    }

    const onAddAssignmentSuccess = (newAssignment) => {
        closeModalRef.current.click()

        setCourse({
            ...course,
            assignees: course.assignees.concat(newAssignment.assignee)
        })
    }

    const cancelAssignment = (assigneeId) => {
        RequireAuthorizedApi(
            'DELETE', 
            `/api/v1/${subject}/${identify}/assignments/cancel`, 
            { 
                assignment: { 
                    assignable_id: course.id,
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
            setCourse({
                ...course,
                assignees: course.assignees.filter((assignee) => assignee.id != canceldAssignment.assignee.id)
            })
        })
        .catch((error) => console.log(error))
    }

    const CourseHeader = () => (
        <div>
            <div className="p-6">
                <h1>{course.name}</h1>
            </div>
            <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center justify-content-end">
                    {course.can_edit && <Link to={`edit`} className="btn btn-light" data-testid="edit-course">
                        Edit
                    </Link>}

                    {course.can_delete && <button
                        type="button"
                        className="btn btn-danger"
                        onClick={onDeleteCourse}
                        data-testid="delete-course">
                        Delete
                    </button>}
                </div>
            </div>
        </div>
    )

    const Assignees = () => (
        <>
            <div className="border-bottom mb-3 mt-5">
                <h4>Assignees</h4>
            </div>
            <div className="d-flex align-items-center justify-content-start">
                {course.can_edit && (
                    <button data-bs-toggle="modal" data-bs-target="#assignmentModal" className="mx-3 btn btn-secondary">
                        +
                    </button>
                )}
                <div>
                    {course.assignees?.map((assignee) => (
                        <div key={assignee.id} className="me-3 btn-group" role="group">
                            <Link to={`/partners/${identify}/account/${assignee.id}/profile`} className="btn btn-light" type="button">
                                <UserAvatar user={assignee} size={20} showName={true} />
                            </Link>
                            {course.can_edit && <button data-bs-toggle="modal" data-bs-target={`#cancelAssignment${assignee.id}Confirm`} className="btn btn-light" type="button">-</button>}
                            {course.can_edit &&
                                <Confirmation 
                                    id={`cancelAssignment${assignee.id}Confirm`} 
                                    title="Cancel Assignment"
                                    description="Are you sure ?"
                                    onConfirm={() => cancelAssignment(assignee.id)}
                                />
                            }
                        </div>   
                    ))}
                </div>
            </div>
            {course.can_edit && 
                <Modal
                    id="assignmentModal"
                    title="Add Assignment"
                    closeModalRef={closeModalRef}>
                    <AssignmentForm assignaleType="course" assignaleId={course.id} onSubmitSuccess={onAddAssignmentSuccess} />
                </Modal>
            }
        </>
    )

    return (
        <>
            <CourseHeader />
            <Assignees />
            
            <div className="border-bottom mb-3 mt-5">
                <h4>Milestones</h4>
            </div>
            {course.milestones?.map((milestone) => (
                <Milestone
                    key={milestone.id}
                    courseId={course.id}
                    milestone={milestone}
                    onDeleteSuccess={onDeleteMilestoneSuccess}
                />
            ))}

            {showMilestoneForm ? (
                <MilestoneForm 
                    milestone={{}} 
                    submitMethod={'POST'}
                    submitEndpoint={`/api/v1/${subject}/${identify}/courses/${course.id}/milestones`}
                    onSubmitSuccess={onAddNewMilestoneSuccess} 
                    onSubmitError={() => {}}
                />
            ) : (
                course.can_edit && 
                <button
                    type="button"
                    className="btn btn-danger"
                    onClick={addNewMileStone}
                    data-testid="add-new-milestone">
                    Add Milestone
                </button>
            )}
        </>
    )
}

export default CourseDetail
