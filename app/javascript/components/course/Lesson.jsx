import React, { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useAppContext } from "../../context/AppProvider"
import LessonForm from "./LessonForm"
import usePathFinder from "../../hooks/usePathFinder"
import Assignees from "../assignment/Assignees"

const Lesson = () => {
    const navigate = useNavigate()
    const params = useParams()
    const { RequireAuthorizedApi } = useAppContext()
    const { lessonApiUrl } = usePathFinder()
    const { coursePath } = usePathFinder()
    
    const [lesson, setLesson] = useState({loading: true, edit: false})

    useEffect(() => {
        RequireAuthorizedApi('GET', lessonApiUrl(params.course_id, params.milestone_id, params.id))
            .then((res) => {
                if (res.ok) {
                    return res.json()
                }

                throw new Error('Something went wrong!')
            })
            .then((lesson) => setLesson({...lesson, loading: false}))
            .catch(() => {})
    }, [params.id])


    const onEditLesson = () => {
        setLesson({...lesson, edit: true})
    }

    const onUpdateSuccess = (updatedLesson) => {
        setLesson({...lesson, ...updatedLesson, edit: false})
    }

    const onUpdateError = (errors) => {

    }

    const onDeleteLesson = (event) => {
        event.preventDefault()

        RequireAuthorizedApi('DELETE', lessonApiUrl(params.course_id, params.milestone_id, params.id))
            .then((response) => {
                if (response.ok) {
                    navigate(`/courses/${params.course_id}`)
                }
                throw new Error('Something went wrong!')
            })
            .catch((error) => console.log(error))
    }

    const onAddAssignmentSuccess = (newAssignment) => {
        setLesson({
            ...lesson,
            assignees: lesson.assignees.concat(newAssignment.assignee)
        })
    }

    const onCancelAssignmentSuccess = (canceledAssignment) => {
        setLesson({
            ...lesson,
            assignees: lesson.assignees.filter((assignee) => assignee.id != canceledAssignment.assignee.id)
        })
    }

    return (
        <>  
            {lesson.loading ? (
                <h1>Loading Lesson ... </h1>
            ) : (
                lesson.edit ? (
                    <LessonForm
                        lesson={lesson}
                        submitEndPoint={lessonApiUrl(params.course_id, params.milestone_id, lesson.id)}
                        submitMethod={'PUT'}
                        onSubmitSuccess={onUpdateSuccess}
                        onSubmitError={onUpdateError}
                    />
                ) : (
                    <div>
                        <Link to={coursePath(lesson.course_id)}>Back to course</Link>
                        <h1 className="text-capitalize text-decoration-underline">{`#${lesson.id} ${lesson.name}`}</h1>
                        <div className="d-flex align-items-center justify-content-between">
                            {lesson.created_time && <div className="fst-italic">created: {lesson.created_time}, updated: {lesson.updated_time}</div>}
                            <div className="d-flex align-items-center justify-content-end btn-group" role="group">
                                {lesson.can_edit && <button
                                    type="button"
                                    className="btn btn-light"
                                    onClick={onEditLesson}
                                    data-testid="edit-lesson">
                                    Edit
                                </button>}
                                
                                {lesson.can_delete && <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={onDeleteLesson}
                                    data-testid="delete-lesson">
                                    Delete
                                </button>}
                            </div>
                        </div>
                        <h6 className="text-nowrap bd-highlight" style={{width: '8rem'}}>estimated time: {lesson.estimated_minutes} minutes</h6>
                        
                        {lesson.can_edit ? (
                        <>
                            <div className="border-bottom mb-3 mt-5">
                                <h4>Assignees</h4>
                            </div>
                            <Assignees 
                                assignees={lesson.assignees} 
                                can_edit={lesson.can_edit}
                                assignableId={lesson.id} assignableType="Lesson"
                                onAddAssignmentSuccess={onAddAssignmentSuccess}
                                onCancelAssignmentSuccess={onCancelAssignmentSuccess}
                            />
                        </>) : (
                        <>
                            <div className="mb-3 mt-5 d-flex justify-content-start">
                                <span>Instructors:</span>
                                <Assignees
                                    assignees={lesson.assignees} 
                                    can_edit={false}
                                />
                            </div>
                        </>)}

                        <div className="card mt-5">
                            <div className="card-body" dangerouslySetInnerHTML={{ __html: lesson.content }} />
                        </div>
                    </div>
                )
            )}
        </>
    )
}

export default Lesson
