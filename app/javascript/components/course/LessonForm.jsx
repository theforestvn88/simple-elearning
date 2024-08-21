import React from "react"
import { useAppContext } from "../../context/AppProvider"

const LessonForm = ({lesson, submitEndPoint, submitMethod, onSubmitSuccess, onSubmitError }) => {
    const { RequireAuthorizedApi } = useAppContext()
    const lessonData = new FormData()

    const onChange = (event) => {
        lessonData.set(`lesson[${event.target.name}]`, event.target.value)
    }

    const onSubmit = (event) => {
        event.preventDefault()

        RequireAuthorizedApi(submitMethod, submitEndPoint, {
            'Content-Type': 'multipart/form-data'
        }, lessonData)
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
            </div>
            <button type="submit" className="btn btn-dark mt-3">
                Submit
            </button>
        </form>
    )
}

export default LessonForm
