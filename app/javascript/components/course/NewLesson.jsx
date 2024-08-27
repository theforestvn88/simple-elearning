import React, { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAppContext } from "../../context/AppProvider"
import LessonForm from "./LessonForm"

const NewLesson = () => {
    const navigate = useNavigate()
    const params = useParams()
    const { subject, identify } = useAppContext()

    const onSubmitSuccess = (responseLesson) => {
        navigate(`milestones/${params.milestone_id}/lessons/${responseLesson.id}`)
    }

    const onSubmitError = (error) => {
        console.log(error)
    }

    return (
        <>
            <h1 className="font-weight-normal mb-5">Add new lesson</h1>
            <LessonForm
                lesson={{name: '', estimated_minutes: 0}}
                submitEndPoint={`/api/v1/${subject}/${identify}/courses/${params.course_id}/milestones/${params.milestone_id}/lessons`}
                submitMethod={'POST'}
                onSubmitSuccess={onSubmitSuccess}
                onSubmitError={onSubmitError}
            />
        </>
    )
}

export default NewLesson
