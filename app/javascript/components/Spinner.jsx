import React from "react"

const Spinner = ({ size }) => {
    return (
        <div className="d-flex justify-content-center">
            {[...Array(size)].map((e, i) => (
                <div key={i} className="spinner-grow text-secondary mx-1" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            ))}
        </div>
    )
}

export default Spinner
