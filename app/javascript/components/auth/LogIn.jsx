import React, { useMemo, useRef } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAppContext } from "../../context/AppProvider"

const LogIn = ({showSignUp = true}) => {
    const navigate = useNavigate()
    const location = useLocation()
    const BaseIndex = useMemo(() => {
        const parts = location.pathname.split("/")
        const authIndex = parts.findIndex(part => part == "auth")
        return authIndex - parts.length
    }, [location.pathname])

    const { auth } = useAppContext()

    const emailRef = useRef(null)
    const passwordRef = useRef(null)

    const onSubmit = (event) => {
        event.preventDefault()

        const loginParams = { email: emailRef.current.value, password: passwordRef.current.value }
        auth.login(loginParams).then((response) => {
            if (response.token) {
                navigate(BaseIndex)
            }
        })
        .catch((error) => console.log(error))
    }

    return (
        <>
            <div className="container py-5 px-5">
                <h3>Log In</h3>
                <form onSubmit={onSubmit} data-testid="login-form">
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
                    <div className="d-flex flex-row justtify justify-content-between align-items-center mt-3">
                        <input type="submit" value="Log In" className="btn btn-dark" />
                        {showSignUp && <Link to="/auth/signup">Sign Up</Link>}
                    </div>
                </form>
            </div>
        </>
    )
}

export default LogIn
