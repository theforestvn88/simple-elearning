import React from "react"
import { Outlet } from "react-router-dom"
import Nav from "../Nav"
import Breadcrumbs from "../Breadcrumbs"

const Account = () => {
    return (
        <>
            <div className="container py-5">
                <Nav />
                <Breadcrumbs />
                <Outlet />
            </div>
        </>
    )
}

export default Account
