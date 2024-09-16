import React, { useRef } from "react"

const Collapse = (props) => {
    const targetRef = useRef()
    const toggleTarget = (event) => {
        event.preventDefault()

        targetRef.current.classList.toggle('show')
    }

    return (
        <div className="card my-2">
            <div className="card-header" role="button" onClick={toggleTarget}>
                {props.children[0]}
            </div>
            <div ref={targetRef} className="collapse">
                <div className="card-body">
                    {props.children[1]}
                </div>
            </div>
        </div>
    )
}

export default Collapse
