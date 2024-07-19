import React from "react"
import { Link } from "react-router-dom"
import { useAppContext } from "../context/AppProvider"
import UserAvatar from "./UserAvatar"

const Nav = ({ showAuth = true }) => {
    const { auth } = useAppContext()
    const logOut = async () => {
        auth.logout()
            .catch((error) => console.log(error))
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light p-5 mb-5">
            <Link to="/courses" className="navbar-brand">Open Courses</Link>
            {showAuth && <>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                        { !auth.info.token ? (
                                <ul className="navbar-nav">
                                    <li className="nav-item">
                                        <Link to="/auth/login" className="nav-link">Log In</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/auth/signup" className="nav-link">Sign Up</Link>
                                    </li>
                                </ul>
                            ) : (
                                <div className="nav navbar-nav navbar-right dropdown">
                                    <a className="btn btn-light dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                                        <UserAvatar user={auth.info.user} size={40} showName={true} />
                                    </a>
                
                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                        <Link to={`/account/${auth.info.user?.id}/profile`} className="dropdown-item">Profile</Link>
                                        <Link to={`/account/${auth.info.user?.id}/settings`} className="dropdown-item">Settings</Link>
                                        <button onClick={logOut} className="btn btn-dark dropdown-item">
                                            Log Out
                                        </button>
                                    </ul>
                                </div>
                            )
                        }
                </div>
            </>}
        </nav>
    )
}

export default Nav
