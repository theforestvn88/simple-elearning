import React from "react"
import { useAppContext } from "../../context/AppProvider"

const MilestoneForm = ({milestone, submitMethod, submitEndpoint, onSubmitSuccess, onSubmitError, onCancel}) => {
    const { RequireAuthorizedApi } = useAppContext()

    const milestoneData = new FormData()

    const onChange = (event) => {
        milestoneData.set(`milestone[${event.target.name}]`, event.target.value)
    }

    const onSubmit = async (event) => {
        event.preventDefault()
    
        RequireAuthorizedApi(submitMethod, submitEndpoint, milestoneData)
          .then((response) => {
            if (response.ok) {
                return response.json()
            } else if (response.status == 401) {
                navigate('/auth/login')
                return
            }
      
            throw new Error('Something went wrong!')
          })
          .then((responseMilestone) => {
            if (onSubmitSuccess && (typeof onSubmitSuccess === 'function')) {
              onSubmitSuccess(responseMilestone)
            }
          })
          .catch((error) => {
            if (onSubmitError && (typeof onSubmitError === 'function')) {
              onSubmitError(error)
            }
          })
    }

    return (
        <form onSubmit={onSubmit} data-testid="milestone-form">
          <div className="form-group">
            <label htmlFor="milestoneName">Name</label>
            <input
              type="text"
              id="milestoneName"
              name="name"
              defaultValue={milestone.name}
              placeholder="Name"
              className="form-control"
              required
              onChange={onChange}
            />

            <label htmlFor="milestonePosition">Position</label>
            <input
              type="number"
              id="milestonePosition"
              name="position"
              defaultValue={milestone.position}
              placeholder="Position"
              className="form-control"
              required
              onChange={onChange}
            />
          </div>
          <div className="form-row align-items-center mt-3">
            <button type="submit" className="btn btn-dark col-auto me-2">
              Submit
            </button>
            <button className="btn btn-light col-auto" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
    )
}

export default MilestoneForm
