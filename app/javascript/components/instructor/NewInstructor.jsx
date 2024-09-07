import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppContext } from "../../context/AppProvider"

const NewInstructor = () => {
    const navigate = useNavigate()
    const { RequireAuthorizedApi } = useAppContext()
    const instructorData = new FormData()

    const onChangeInfo = (event) => {
        instructorData.set(`instructor[${event.target.name}]`, event.target.value)
    }

    const submit = async (event) => {
        event.preventDefault()

        RequireAuthorizedApi('POST', `/api/v1/instructors`, instructorData)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                } else if (response.status == 401) {
                    navigate('/auth/login')
                    return
                }

                throw new Error('Something went wrong!')
            })
            .then((responseInstructor) => {
                navigate(`../${responseInstructor.id}`, { relative: "path" })
            })
            .catch((error) => {
            })
    }

    return (
        <div className="container py-5 px-5">
            <h3>New Instructor</h3>
            <form onSubmit={submit} data-testid="create-instructor-form">
                <div className="form-group">
                    <label htmlFor="instructorEmail">Email</label>
                    <input
                        type="text"
                        id="instructorEmail"
                        name="email"
                        placeholder="Email"
                        className="form-control"
                        onChange={onChangeInfo}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="instructorName">Name</label>
                    <input
                        type="text"
                        id="instructorName"
                        name="name"
                        placeholder="Name"
                        className="form-control"
                        onChange={onChangeInfo}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="instructorRank">Rank</label>
                    <select
                        className="form-select" 
                        id="instructorRank"
                        name="rank"
                        defaultValue="Lecturer"
                        onChange={onChangeInfo}
                        required>
                        <option value="Lecturer">Lecturer</option>
                        <option value="Assistant Professor">Assistant Professor</option>
                        <option value="Associate Professor">Associate Professor</option>
                        <option value="Professor">Professor</option>
                    </select>
                </div>

                <input type="submit" value="Add" className="btn btn-dark mt-3" />
            </form>
        </div>
    )
}

export default NewInstructor
