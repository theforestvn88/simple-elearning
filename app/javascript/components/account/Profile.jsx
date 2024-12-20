import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import useApi from "../../hooks/useApi"
import { useAppContext } from "../../context/AppProvider"
import ProfileForm from "./ProfileForm"
import Confirmation from "../Confirmation"
import Spinner from "../Spinner"
import Overlay from "../Overlay"
import UserAvatar from "../UserAvatar"
import usePathFinder from "../../hooks/usePathFinder"

const Profile = () => {
    const navigate = useNavigate()
    const params = useParams()
    const { QueryApi } = useApi()
    const { subject, auth, clearAuth, RequireAuthorizedApi } = useAppContext()
    const { profileApiUrl } = usePathFinder()

    const [editMode, setEditMode] = useState(false)

    const [profile, setProfile] = useState({
        social_links: []
    })

    const [onDeleteAccount, setOnDeleteAccount] = useState(false)

    const onUpdateProfileSuccess = (updateProfile) => {
        auth.saveUserInfo(updateProfile)
        setProfile(updateProfile)
        setEditMode(false)
    }

    const deleteAccount = () => {
        setOnDeleteAccount(true)

        RequireAuthorizedApi('DELETE', profileApiUrl(profile.id))
            .then((response) => {
                if (response.ok) {
                    setOnDeleteAccount(false)
                    clearAuth()
                    navigate('/')
                } else if (response.status == 401) {
                    navigate('/auth/login')
                    return
                }

                throw new Error('Something went wrong!')
            })
            .catch((error) => {
                console.log(error)
                setOnDeleteAccount(false)
            })
    }

    useEffect(() => {
        QueryApi(profileApiUrl(params.id), {}, {'X-Auth-Token': auth.info.token})
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }

                throw new Error('Something went wrong!')
            })
            .then((userProfile) => {
                setProfile({
                    ...userProfile
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }, [params.id])

    return (
        <>
            {editMode ? (
                <ProfileForm userProfile={profile} onSubmitSuccess={onUpdateProfileSuccess} />
            ) : (
                <>
                    <div className="row gutters-sm">
                        <div className="col-md-4 mb-3">
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex flex-column align-items-center text-center">
                                        <UserAvatar user={profile} size={150} showName={false} />
                                        <div className="mt-3">
                                            <h4>{profile.name}</h4>
                                            {profile.rank && <p className="text-secondary mb-1">{profile.rank}</p>}
                                            <p className="text-secondary mb-1">{profile.title}</p>
                                            <p className="text-muted font-size-sm">{profile.location}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card mt-3">
                                <ul className="list-group list-group-flush">
                                    {profile.social_links && profile.social_links.map((social) => (
                                        <li key={social.id} className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                            <h6 className="mb-0">{social.name}</h6>
                                            <a href={social.link} className="text-secondary">{social.link}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="col-md-8">
                            <div className="row gutters-sm">
                                <h6>About</h6>
                                <p>{profile.introduction}</p>
                            </div>

                            {profile.skills && <div className="row gutters-sm">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <h6 className="d-flex align-items-center mb-3">Skills</h6>
                                        {profile.skills.map((skill) => (
                                            <div key={skill.name}>
                                                <small>{skill.name}</small>
                                                <div className="progress mb-3" style={{height: '5px'}}>
                                                    <div className="progress-bar bg-primary" role="progressbar" style={{width: `${skill.level*10}%`}} aria-valuenow={skill.level*10} aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>}
                            {profile.certificates && <div className="row gutters-sm mt-3">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <h6 className="d-flex align-items-center mb-3">Certificates</h6>
                                        {profile.certificates.map((cert) => (
                                            <div key={cert.name}>
                                                <small>{cert.name}</small>
                                                <div className="progress mb-3" style={{height: '5px'}}>
                                                    <div className="progress-bar bg-primary" role="progressbar" style={{width: `${cert.grade*10}%`}} aria-valuenow={cert.grade*10} aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>}
                        </div>
                    </div>
                    
                    <div className="d-flex align-items-center justify-content-end mb-2">
                        {profile.can_edit && <button onClick={() => setEditMode(true)} className="btn btn-dark">Edit Profile</button>}
                        {profile.can_delete && <button data-bs-toggle="modal" data-bs-target="#deleteAccountConfirmation" className="ms-3 btn btn-danger">Delete Account</button>}
                    </div>

                    {profile.can_delete && 
                        <Confirmation
                            id="deleteAccountConfirmation" 
                            title="Delete Account"
                            description="Are you sure ?"
                            onConfirm={deleteAccount}
                        />
                    }

                    {onDeleteAccount && <Overlay><Spinner size={8} /></Overlay>}
                </>
            )}
        </>
    )
}

export default Profile
