import React, { useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAppContext } from "../../context/AppProvider"
import usePathFinder from "../../hooks/usePathFinder"

const SignUp = () => {
    const navigate = useNavigate()
    const { auth } = useAppContext()
    const { authSuccessPath } = usePathFinder()

    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const passwordConfirmationRef = useRef(null)
    const nameRef = useRef(null)

    const onSubmit = (event) => {
        event.preventDefault()

        const signupParams = { 
            email: emailRef.current.value, 
            password: passwordRef.current.value,
            password_confirmation: passwordConfirmationRef.current.value,
            name: nameRef.current.value,
        }

        auth.signup(signupParams).then((response) => {
            if (response.token) {
                navigate(authSuccessPath)
            }
        })
        .catch((error) => console.log(error))
    }

    return (
        <>
            <div className="container py-5 px-5">
                <h3>Sign Up</h3>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            ref={emailRef}
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            className="form-control"
                            required
                        />

                        <label htmlFor="name">Name</label>
                        <input
                            ref={nameRef}
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Name"
                            className="form-control"
                            required
                        />

                        <label htmlFor="password">Password</label>
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

                        <label htmlFor="passwordConfirmation">Password Confirmation</label>
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
                    </div>
                    <div className="d-flex flex-row justtify justify-content-between align-items-center mt-3">
                        <input type="submit" value="Sign Up" className="btn btn-dark" />
                        <Link to="/auth/login">Log In</Link>
                    </div>
                </form>
            </div>
        </>
    )
}

export default SignUp
