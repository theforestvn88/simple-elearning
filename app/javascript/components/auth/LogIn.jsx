import React, { useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAppContext } from "../../context/AppProvider"

const LogIn = () => {
    const navigate = useNavigate()
    const { auth } = useAppContext()

    const emailRef = useRef(null)
    const passwordRef = useRef(null)

    const onSubmit = (event) => {
        event.preventDefault()

        const loginParams = { email: emailRef.current.value, password: passwordRef.current.value }
        auth.login(loginParams).then((response) => {
            if (response.token) {
                navigate('/courses')
            }
        })
        .catch((error) => console.log(error))
    }

    return (
        <>
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
                        autoComplete="off"
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
                        required
                    />
                </div>
                <input type="submit" value="Log In" className="btn custom-button mt-3" />
            </form>
        </>
    )
}

export default LogIn
