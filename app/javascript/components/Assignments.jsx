import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Paginaton from "./Pagination"
import useApiQuery from "../hooks/useApiQuery"

const Assignments = () => {
    const { setQuery, responseData } = useApiQuery('/assignments')
    const [currPage, setCurrPage] = useState(1)

    useEffect(() => {
        setQuery({page: currPage})
    }, [currPage])

    const AssignmentLink = ({assignment}) => (
        <tr key={assignment.id}>
            <td>
                <span>You're assigned to</span>
                <Link to={`../${assignment.assignable_path}`}>
                    [{`${assignment.assignable_type}.${assignment.assignable_id}] ${assignment.assignable_name}`}
                </Link>
            </td>
            <td>{assignment.created_time}</td>
        </tr>
    )
    
    return (
        <>
            {responseData.loading ? (
                <div>Loading ...</div>
            ) : (
                <>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Assignment</th>
                                <th>Time</th> 
                            </tr>
                        </thead>
                        <tbody>
                            {responseData.data.assignments && responseData.data.assignments.map((assignment) => <AssignmentLink assignment={assignment} />)}
                        </tbody>
                    </table>

                    <br />

                    {responseData.data.pagination && 
                        <Paginaton
                            pagination={responseData.data.pagination}  
                            currentPage={currPage} 
                            selectedPage={setCurrPage} />}
                </>
            )}
        </>
    )
}

export default Assignments
