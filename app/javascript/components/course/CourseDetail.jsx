import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import MilestoneForm from './MilestoneForm'
import { useAppContext } from '../../context/AppProvider'
import Milestone from './Milestone'

const CourseDetail = () => {
    const navigate = useNavigate()
    const params = useParams()
    const {subject, identify, RequireAuthorizedApi} = useAppContext()

    const [course, setCourse] = useState({})
    const [showMilestoneForm, setShowMilestoneForm] = useState(false)

    useEffect(() => {
        const courseUrl = `/api/v1/${subject}/${identify}/courses/${params.id}`
        RequireAuthorizedApi('GET', courseUrl, {}, {})
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

        RequireAuthorizedApi('DELETE', deleteCourseUrl, {}, {})
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

  return (
    <>
        <div className="p-6">
            <h1 className="display-4">{course.name}</h1>
        </div>
        <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center justify-content-end">
                <Link to={`/courses/${course.id}/edit`} className="btn btn-light">
                    Edit
                </Link>
                <button
                    type="button"
                    className="btn btn-danger"
                    onClick={onDeleteCourse}
                >
                    Delete
                </button>
            </div>
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
            <button
                type="button"
                className="btn btn-danger"
                onClick={addNewMileStone}
            >
                Add Milestone
            </button>
        )}
    </>
  )
}

export default CourseDetail
