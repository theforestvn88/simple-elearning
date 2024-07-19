import React, { useRef } from "react"
import { useAppContext } from "../../context/AppProvider"
import { useNavigate } from "react-router-dom"

const UpdatePasswordForm = () => {
    const navigate = useNavigate()
    const { auth } = useAppContext()

    const oldPasswordRef = useRef(null)
    const passwordRef = useRef(null)
    const passwordConfirmationRef = useRef(null)

    const updateSubmit = (event) => {
        event.preventDefault()

        const updatePasswordParams = {
            password_challenge: oldPasswordRef.current.value,
            password: passwordRef.current.value,
            password_confirmation: passwordConfirmationRef.current.value
        }

        auth.changePassword(updatePasswordParams).then((response) => {
            if (response.ok) {
                navigate('/auth/login')
            }
        })
        .catch((error) => console.log(error))
    }

    return (
        <form onSubmit={updateSubmit}>
            <label htmlFor="oldPassword">Old Password</label>
            <input
                ref={oldPasswordRef}
                type="password"
                id="oldPassword"
                name="passwordChallenge"
                placeholder="Old Password"
                className="form-control"
                autoComplete="off"
                min="10"
                required
            />

            <label htmlFor="password">New Password</label>
            <input
                ref={passwordRef}
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                className="form-control"
                autoComplete="off"
                min="10"
                required
            />

            <label htmlFor="passwordConfirmation">New Password Confirmation</label>
            <input
                ref={passwordConfirmationRef}
                type="password"
                id="passwordConfirmation"
                name="passwordConfirmation"
                placeholder="Password Confirmation"
                className="form-control"
                autoComplete="off"
                min="10"
                required
            />

            <input type="submit" value="Update" className="btn btn-dark mt-1" />
        </form>
    )
}

export default UpdatePasswordForm
