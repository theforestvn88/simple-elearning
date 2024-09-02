import { useEffect, useState } from "react"
import { useAppContext } from "../context/AppProvider"

const useCoursesQuery = () => {
    const { subject, identify, RequireAuthorizedApi } = useAppContext()
    const [query, setQuery] = useState(null)
    const [loading, setLoading] = useState(false)
    const [coursesData, setCoursesData] = useState({ courses: [], pagination: null })

    useEffect(() => {
        if (query === null) return

        setLoading(true)
        RequireAuthorizedApi('GET', `/api/v1/${subject}/${identify}/courses`, query)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }

                throw new Error('Something went wrong!')
            })
            .then((responseCoursesData) => {
                setCoursesData(responseCoursesData)
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [query])

    return {
        setQuery,
        loading,
        coursesData,
    }
}

export default useCoursesQuery
