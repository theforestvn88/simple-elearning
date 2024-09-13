import React from "react"

const Modal = (props) => {
    return (
        <div id={props.id} className="modal fade">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">{props.title}</h5>
                        <button ref={props.closeModalRef} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body position-relative">
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal
