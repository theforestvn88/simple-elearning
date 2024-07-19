import React, { useMemo } from "react"
import { Link, Outlet, useLocation } from "react-router-dom"
import { useAppContext } from "../../context/AppProvider"

const Settings = () => {
    const location = useLocation()
    const currentSetting = useMemo(() => {
        const parts = location.pathname.split("/")
        return parts[parts.length-1]
    }, [location.pathname])

    const { auth } = useAppContext()

    // TODO: move delete account here

    return (
        <>
            <div className="container">
                <div className="row flex-nowrap border border-1">
                    <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-light">
                        <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 min-vh-100">
                            <h3 className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-decoration-none">Settings</h3>
                            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="settings-menu">
                                <li className="nav-item">
                                    <Link 
                                        to={`/account/${auth.info.user?.id}/settings`} 
                                        className={currentSetting=='settings' ? '' : 'text-decoration-none'}
                                    >
                                        Preferences
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link 
                                        to={`/account/${auth.info.user?.id}/settings/auth`} 
                                        className={currentSetting=='auth' ? '' : 'text-decoration-none'}
                                    >
                                        Authentication
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link 
                                        to={`/account/${auth.info.user?.id}/settings/session`} 
                                        className={currentSetting=='session' ? '' : 'text-decoration-none'}
                                    >
                                        Session
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link 
                                        to={`/account/${auth.info.user?.id}/settings/notification`} 
                                        className={currentSetting=='notification' ? '' : 'text-decoration-none'}
                                    >
                                        Notification
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link 
                                        to={`/account/${auth.info.user?.id}/settings/billing`} 
                                        className={currentSetting=='billing' ? '' : 'text-decoration-none'}
                                    >
                                        Billing
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col py-3">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Settings
