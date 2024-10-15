import React from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import usePathFinder from "../../hooks/usePathFinder"
import LessonForm from "./LessonForm"

const NewLesson = () => {
    const navigate = useNavigate()
    const params = useParams()
    const { newLessonApiUrl, lessonPath, coursePath } = usePathFinder()

    const onSubmitSuccess = (responseLesson) => {
        navigate(lessonPath(params.course_id, params.milestone_id, responseLesson.id))
    }

    const onSubmitError = (error) => {
        console.log(error)
    }

    return (
        <>
            <Link to={coursePath(params.course_id)}>Back to course</Link>
            <h1 className="font-weight-normal mb-5">Add new lesson</h1>
            <LessonForm
                lesson={{name: '', estimated_minutes: 0}}
                submitEndPoint={newLessonApiUrl(params.course_id, params.milestone_id)}
                submitMethod={'POST'}
                onSubmitSuccess={onSubmitSuccess}
                onSubmitError={onSubmitError}
            />
        </>
    )
}

export default NewLesson
