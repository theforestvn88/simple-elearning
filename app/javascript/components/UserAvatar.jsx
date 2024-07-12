import React from "react"
import DefaultAvatar from "./icons/DefaultAvatar"

const UserAvatar = ({user, size, showName}) => {
    return (
        <>
            {user?.avatar?.url ? (
                <img src={user.avatar?.url} className="rounded-circle" width={size} />
            ) : (
                <DefaultAvatar size={size} />
            )}
            {showName && <span>{user?.name}</span>}
        </>
    )
}

export default UserAvatar
