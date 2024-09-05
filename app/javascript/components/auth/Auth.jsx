import React from "react"
import { Outlet } from "react-router-dom"
import Nav from "../Nav"

const Auth = () => {
    return (
        <div className="container py-5">
            <Nav showAuth={false} />
            <Outlet />
        </div>
    )
}

export default Auth
