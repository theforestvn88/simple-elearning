import React from "react"

const Confirmation = ({ id, title, description, onConfirm, onCancel= () => {} }) => {
    return (
        <div id={id} className="modal fade">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">{title}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">{description}</div>
                    <div className="modal-footer">
                        <button type="button" onClick={onCancel} className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" onClick={onConfirm} className="btn btn-primary" data-bs-dismiss="modal">Confirm</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Confirmation
