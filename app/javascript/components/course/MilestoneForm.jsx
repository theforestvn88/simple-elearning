import React from "react"
import { useAppContext } from "../../context/AppProvider"

const MilestoneForm = ({milestone, submitMethod, submitEndpoint, onSubmitSuccess, onSubmitError}) => {
    const { RequireAuthorizedApi } = useAppContext()

    const milestoneData = new FormData()

    const onChange = (event) => {
        milestoneData.set(`milestone[${event.target.name}]`, event.target.value)
    }

    const onSubmit = async (event) => {
        event.preventDefault()
    
        RequireAuthorizedApi(submitMethod, submitEndpoint, {
            'Content-Type': 'multipart/form-data'
        }, milestoneData)
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
          onSubmitSuccess(responseMilestone)
        })
        .catch((error) => {
          onSubmitError(error)
        })
    }

    return (
        <form onSubmit={onSubmit}>
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
          </div>
          <button type="submit" className="btn btn-dark mt-3">
            Submit
          </button>
        </form>
    )
}

export default MilestoneForm
