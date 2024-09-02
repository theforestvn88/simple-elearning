import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAppContext } from "../context/AppProvider"
import Paginaton from "./Pagination"

const Assignments = () => {
    const { subject, identify, RequireAuthorizedApi } = useAppContext()
    const [assignmentsData, setAssignmentsData] = useState({ assignments: [], pagination: null })
    const [currPage, setCurrPage] = useState(1)

    useEffect(() => {
        RequireAuthorizedApi('GET', `/api/v1/${subject}/${identify}/assignments`, {page: currPage})
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }

                throw new Error('Something went wrong!')
            })
            .then((responseAssignmentsData) => {
                setAssignmentsData(responseAssignmentsData)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [currPage])

    const AssignmentLink = ({assignment}) => (
        <tr key={assignment.id}>
            <td>
                <Link to={`../${assignment.assignable_path}`}>
                    You're assigned to [{`${assignment.assignable_type}.${assignment.assignable_id}] ${assignment.assignable_name}`}
                </Link>
            </td>
            <td>{assignment.created_time}</td>
        </tr>
    )
    
    return (
        <>
            <table className="table">
                <thead>
                    <tr>
                        <th>Assignment</th>
                        <th>Time</th> 
                    </tr>
                </thead>
                <tbody>
                    {assignmentsData.assignments.map((assignment) => <AssignmentLink assignment={assignment} />)}
                </tbody>
            </table>

            <br />

            {assignmentsData.pagination && 
                <Paginaton
                    pages={assignmentsData.pagination.pages} 
                    currentPage={currPage} 
                    selectedPage={setCurrPage} 
                    totalPage={assignmentsData.pagination.total} />}
        </>
    )
}

export default Assignments
