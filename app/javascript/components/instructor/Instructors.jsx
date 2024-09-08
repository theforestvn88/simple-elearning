import React, { useEffect } from "react"
import useApiQuery from "../../hooks/useApiQuery"
import { useAppContext } from "../../context/AppProvider"
import CardListPlaceHolders from "../CardListPlaceHolders"
import EmptyList from "../EmptyList"
import { Link } from "react-router-dom"
import Paginaton from "../Pagination"
import usePermission from "../../hooks/usePermission"

const Instructors = () => {
    const { identify } = useAppContext()
    const { canCreateInstructor } = usePermission()
    const { setQuery, responseData } = useApiQuery('instructors')

    useEffect(() => {
        setQuery({partner_slug: identify})
    }, [])

    const instructorsList = (instructors) => instructors.map((instructor, index) => (
        <div key={index} className="card px-0 my-1 mx-2 border-secondary" style={{width: '18rem'}}>
          {instructor.avatar ? (
            <img className="card-header p-0 card-img-top img-fluid w-100" src={instructor.avatar.url} />
          ) : (
            <div className="card-header p-0 card-img-top img-fluid w-100"></div>
          )}
          <div className="card-body">
            <h5 className="card-title">{instructor.name}</h5>
            <p className="card-text">{instructor.rank}</p>
            <Link to={`${instructor.id}`} className="btn btn-primary">Portfolio</Link>
          </div>
        </div>
    ))

    return (<>
        {responseData.loading ? (
            <CardListPlaceHolders rowSize={3} colSize={1} />
        ) : (
            <>
                <div className="text-end mb-3">
                    {canCreateInstructor() && <Link to="new" className="btn link-underline-opacity-100-hover">
                        Add New Instructor
                    </Link>}
                </div>

                <div className="container-fluid d-flex justify-content-start flex-wrap">
                    {(responseData.data && responseData.data.length > 0) ? instructorsList(responseData.data) : <EmptyList content='No Instructors'/>}
                </div>
    
                <br />
    
                {responseData.data.pagination &&
                    <Paginaton 
                        pagination={responseData.data.pagination} 
                        currentPage={currPage} 
                        selectedPage={setCurrPage} />
                }
            </>
        )}
    </>)
}

export default Instructors
