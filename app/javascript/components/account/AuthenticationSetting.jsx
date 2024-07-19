import React, { useState } from "react"
import UpdatePasswordForm from "./UpdatePasswordForm"

const AuthenticationSetting = () => {
    const [changePassword, setChangePassword] = useState(false)

    return (
        <>
            <h5>Password</h5>
            <hr />
            {changePassword ? (
                <UpdatePasswordForm />
            ) : (
                <div>
                    <p>Strengthen your account by ensuring your password is strong.</p>
                    <button className="btn btn-light" onClick={() => setChangePassword(true)}>Change Password</button>
                </div>
            )}


            <h5 className="mt-5">Two-factor authentication</h5>
            <hr />
        </>
    )
}

export default AuthenticationSetting
