import React, { useEffect, useRef } from "react"
import Trix from "trix"
import { useAppContext } from "../../context/AppProvider"

const LessonForm = ({lesson, submitEndPoint, submitMethod, onSubmitSuccess, onSubmitError }) => {
    const { RequireAuthorizedApi } = useAppContext()
    const trixEditorRef = useRef()
    const lessonData = new FormData()

    const onChange = (event) => {
        lessonData.set(`lesson[${event.target.name}]`, event.target.value)
    }

    const onSubmit = (event) => {
        event.preventDefault()

        RequireAuthorizedApi(submitMethod, submitEndPoint, lessonData)
            .then((response) => {
            if (response.ok) {
                return response.json()
            } else if (response.status == 401) {
                navigate('/auth/login')
                return
            }
        
            throw new Error('Something went wrong!')
            })
            .then((responseLesson) => {
                if (onSubmitSuccess) {
                    onSubmitSuccess(responseLesson)
                }
            })
            .catch((error) => {
                if (onSubmitError) {
                    onSubmitError(error)
                }
            })
    }

    useEffect(() => {
        if (trixEditorRef && trixEditorRef.current) {
            trixEditorRef.current.addEventListener("trix-change", onChange)
        }

        return () => {
            if (trixEditorRef && trixEditorRef.current) {
                trixEditorRef.current.removeEventListener("trix-change", onChange)
            }
        }
    })

    return (
        <form onSubmit={onSubmit} data-testid="submit-lesson-form">
            <div className="form-group">
                <label htmlFor="lessonName">Lesson name</label>
                <input
                    type="text"
                    id="lessonName"
                    name="name"
                    defaultValue={lesson?.name}
                    placeholder="Name"
                    className="form-control"
                    required
                    onChange={onChange}
                />

                <label htmlFor="coursePosition">Position</label>
                <input
                    type="number"
                    id="coursePosition"
                    name="position"
                    defaultValue={lesson?.position}
                    placeholder="Position"
                    className="form-control"
                    required
                    onChange={onChange}
                />

                <label htmlFor="courseEst">Lesson Estimated Time (in minutes)</label>
                <input
                    type="number"
                    id="courseEst"
                    name="estimated_minutes"
                    defaultValue={lesson?.estimated_minutes}
                    placeholder="Estimated Time (in minutes)"
                    className="form-control"
                    required
                    onChange={onChange}
                />

                <label htmlFor="lessonName">Lesson content</label>
                <input
                    type="hidden"
                    id="lessonContent"
                    name="content"
                    defaultValue={lesson?.content}
                    placeholder=""
                    className="form-control"
                    required
                    onChange={onChange}
                />
                <trix-editor
                    id="trixEditorLessonContent"
                    name="content"
                    input="lessonContent"
                    class="trix-content"
                    ref={trixEditorRef}
                />
            </div>
            <button type="submit" className="btn btn-dark mt-3">
                Submit
            </button>
        </form>
    )
}

export default LessonForm
