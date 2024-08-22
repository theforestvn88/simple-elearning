import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAppContext } from "../../context/AppProvider"
import LessonForm from "./LessonForm"

const Lesson = () => {
    const navigate = useNavigate()
    const params = useParams()
    const {subject, identify, RequireAuthorizedApi} = useAppContext()
    
    const [lesson, setLesson] = useState({loading: true, edit: false})

    useEffect(() => {
        const lessonUrl = `/api/v1/${subject}/${identify}/courses/${params.course_id}/milestones/${params.milestone_id}/lessons/${params.id}`
        RequireAuthorizedApi('GET', lessonUrl, {}, {})
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

        RequireAuthorizedApi('DELETE', deleteLessonUrl, {}, {})
            .then((response) => {
                console.log(response)
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
                        <div className="p-6">
                            <h1 className="display-4">{lesson.name}</h1>
                            <h6 className="display-4">estimated time: {lesson.estimated_minutes} minutes</h6>
                            <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center justify-content-end">
                                <button
                                    type="button"
                                    className="btn btn-light"
                                    onClick={onEditLesson}
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={onDeleteLesson}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )
            )}
        </>
    )
}

export default Lesson
