import { useCallback, useMemo } from "react"
import { useLocation } from "react-router-dom"
import { useAppContext } from "../context/AppProvider"

const usePathFinder = () => {
    const location = useLocation()
    const { subject, identify, userType } = useAppContext()

    const authSuccessPath = useMemo(() => {
        const parts = location.pathname.split("/")
        if (parts[0] === '') {
            parts.shift()
        }
        const authIndex = parts.findIndex(part => part == "auth")
        return authIndex >= 0 ? ('/' + parts.slice(0, authIndex).join("/")) : location.pathname
    }, [location.pathname])

    const partnerApiUrl = useMemo(() => `/api/v1/partner/${identify}/`)
    const partnerUpdateApiUrl = useMemo(() => `/api/v1/partner/${identify}/update`)
    const partnerInstructorProfilePath = useCallback((instructor) => `/partners/${identify}/account/${instructor.id}/profile`)
    const profileApiUrl = useCallback((profileId) => {
        if (subject === 'partner') {
            return `/api/v1/instructors/${profileId}`
        } else {
            return `/api/v1/users/${profileId}`
        }
    })

    const newCourseApiUrl = useMemo(() => `/api/v1/${subject}/${identify}/courses`)
    const courseApiUrl = useCallback((courseId) => `/api/v1/${subject}/${identify}/courses/${courseId}`)
    const coursePath = useCallback((courseId) => `/partners/${identify}/courses/${courseId}`)
    const addMilestoneApiUrl = useCallback((courseId) => `/api/v1/${subject}/${identify}/courses/${courseId}/milestones`)
    const milestoneApiUrl = useCallback((courseId, milestoneId) => `/api/v1/${subject}/${identify}/courses/${courseId}/milestones/${milestoneId}`)
    const newLessonApiUrl = useCallback((courseId, milestoneId) => `/api/v1/${subject}/${identify}/courses/${courseId}/milestones/${milestoneId}/lessons`)
    const lessonApiUrl = useCallback((courseId, milestoneId, lessonId) => `/api/v1/${subject}/${identify}/courses/${courseId}/milestones/${milestoneId}/lessons/${lessonId}`)
    const lessonPath = useCallback((courseId, milestoneId, lessonId) => `/${subject}/${identify}/courses/${courseId}/milestones/${milestoneId}/lessons/${lessonId}`)
    const cancelAssignmentApiUrl = useMemo(() => `/api/v1/${subject}/${identify}/assignments/cancel`)

    return {
        authSuccessPath,
        partnerApiUrl,
        partnerUpdateApiUrl,
        partnerInstructorProfilePath,
        profileApiUrl,
        newCourseApiUrl,
        courseApiUrl,
        coursePath,
        addMilestoneApiUrl,
        milestoneApiUrl,
        newLessonApiUrl,
        lessonApiUrl,
        lessonPath,
        cancelAssignmentApiUrl
    }
}

export default usePathFinder
