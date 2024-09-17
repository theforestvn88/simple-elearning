import React, { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useAppContext } from "../../context/AppProvider"
import LessonForm from "./LessonForm"
import usePathFinder from "../../hooks/usePathFinder"

const Lesson = () => {
    const navigate = useNavigate()
    const params = useParams()
    const {subject, identify, RequireAuthorizedApi} = useAppContext()
    const { coursePath } = usePathFinder()
    
    const [lesson, setLesson] = useState({loading: true, edit: false})

    useEffect(() => {
        const lessonUrl = `/api/v1/${subject}/${identify}/courses/${params.course_id}/milestones/${params.milestone_id}/lessons/${params.id}`
        RequireAuthorizedApi('GET', lessonUrl)
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

        const deleteLessonUrl = `/api/v1/${subject}/${identify}/courses/${params.course_id}/milestones/${params.milestone_id}/lessons/${params.id}`

        RequireAuthorizedApi('DELETE', deleteLessonUrl)
            .then((response) => {
                if (response.ok) {
                    navigate(`/courses/${params.course_id}`)
                }
                throw new Error('Something went wrong!')
            })
            .catch((error) => console.log(error))
    }

    return (
        <>  
            {lesson.loading ? (
                <h1>Loading Lesson ... </h1>
            ) : (
                lesson.edit ? (
                    <LessonForm
                        lesson={lesson}
                        submitEndPoint={`/api/v1/${subject}/${identify}/courses/${params.course_id}/milestones/${params.milestone_id}/lessons/${lesson.id}`}
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
