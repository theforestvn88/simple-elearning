import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import MilestoneForm from './MilestoneForm'
import { useAppContext } from '../../context/AppProvider'
import Milestone from './Milestone'
import Assignees from '../assignment/Assignees'
import usePathFinder from '../../hooks/usePathFinder'

const CourseDetail = () => {
    const navigate = useNavigate()
    const params = useParams()
    const { RequireAuthorizedApi } = useAppContext()
    const { courseApiUrl, addMilestoneApiUrl } = usePathFinder()

    const [course, setCourse] = useState({})
    const [showMilestoneForm, setShowMilestoneForm] = useState(false)

    useEffect(() => {
        RequireAuthorizedApi('GET', courseApiUrl(params.id))
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

        RequireAuthorizedApi('DELETE', courseApiUrl(course.id))
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
        setCourse({
            ...course,
            assignees: course.assignees.concat(newAssignment.assignee)
        })
    }

    const onCancelAssignmentSuccess = (canceledAssignment) => {
        setCourse({
            ...course,
            assignees: course.assignees.filter((assignee) => assignee.id != canceledAssignment.assignee.id)
        })
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

    return (
        <>
            <CourseHeader />

            <div className="border-bottom mb-3 mt-5">
                <h4>Assignees</h4>
            </div>

            <Assignees 
                assignees={course.assignees} 
                can_edit={course.can_edit} 
                assignableId={course.id} assignableType="Course"
                onAddAssignmentSuccess={onAddAssignmentSuccess}
                onCancelAssignmentSuccess={onCancelAssignmentSuccess}
            />
            
            <div className="border-bottom mb-3 mt-5">
                <h4>Milestones</h4>
            </div>

            <div id="milestones" className="accordion">
                {course.milestones?.map((milestone) => (
                    <Milestone
                        key={milestone.id}
                        courseId={course.id}
                        milestone={milestone}
                        onDeleteSuccess={onDeleteMilestoneSuccess}
                    />
                ))}
            </div>

            {showMilestoneForm ? (
                <MilestoneForm 
                    milestone={{}} 
                    submitMethod={'POST'}
                    submitEndpoint={addMilestoneApiUrl(course.id)}
                    onSubmitSuccess={onAddNewMilestoneSuccess} 
                    onSubmitError={() => {}}
                />
            ) : (
                course.can_edit && 
                <button
                    type="button"
                    className="btn btn-danger mt-5"
                    onClick={addNewMileStone}
                    data-testid="add-new-milestone">
                    Add Milestone
                </button>
            )}
        </>
    )
}

export default CourseDetail
