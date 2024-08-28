import React from "react"
import { Outlet } from "react-router-dom"

const Account = () => {
    return (
        <>
            <div className="container">
                <Outlet />
            </div>
        </>
    )
}

export default Account
