import React from "react"

const EmptyList = ({content}) => {
    return (
        <div className="w-100 vh-50 d-flex align-items-center justify-content-center">
            <h4>{content}</h4>
        </div>
    )
}

export default EmptyList
