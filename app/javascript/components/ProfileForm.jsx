import React, { useRef, useState } from "react"
import { useAppContext } from "../context/AppProvider"
import { useNavigate } from "react-router-dom"
import SingleFileUploader from "./SingleFileUploader"

const ProfileForm = ({userProfile, onSubmitSuccess}) => {
    const navigate = useNavigate()
    const { RequireAuthorizedApi } = useAppContext()

    const [profile, setProfile] = useState({...userProfile})

    const updateProfile = new FormData()
    const onChangeInfo = (event) => {
        updateProfile.append(`user[${event.target.name}]`, event.target.value)
    }
    
    const updateAvatar = (image) => {
        updateProfile.append('user[avatar]', image)
    }

    const updateSocialLinks = (social_links) => {
        updateProfile.append('user[social_links]', social_links)

        setProfile({
            ...profile,
            social_links: social_links
        })
    }

    const addSocialLink = (event) => {
        event.preventDefault()

        const new_social_links = profile.social_links.concat({id: profile.social_links.length, name: "", link: ""})
        updateSocialLinks(new_social_links)
    }

    const deleteSocial = (social, event) => {
        event.preventDefault()

        const filter_social_links = profile.social_links.filter((s) => s.id !== social.id)
        updateSocialLinks(filter_social_links)
    }

    const updateSubmit = async (event) => {
        event.preventDefault()
        RequireAuthorizedApi('PUT', `/api/v1/users/${profile.id}`, {
            'Content-Type': 'multipart/form-data'
        }, updateProfile)
        .then((response) => {
            if (response.ok) {
                return response.json()
            } else if (response.status == 401) {
                navigate('/auth/login')
                return
            }

            throw new Error('Something went wrong!')
        })
        .then((updateProfile) => {
            onSubmitSuccess(updateProfile)
        })
        .catch((error) => {
        })
    }

    return (
        <div className="container py-5 px-5">
            <h3>Update Profile</h3>
            <form onSubmit={updateSubmit} data-testid="update-profile-form">
                <div className="form-group">
                <label htmlFor="userName">Avatar</label>
                    <SingleFileUploader
                        id="avatar-dropzone"
                        acceptedFiles="image/jpeg,image/png"
                        file={profile.avatar}
                        uploadedFile={(imageBlobSignedId) => {
                            updateAvatar(imageBlobSignedId)
                        }}
                        unloadedFile={_ => {
                            updateAvatar('')
                        }}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="userName">Name</label>
                    <input
                        type="text"
                        id="userName"
                        name="name"
                        defaultValue={profile.name}
                        placeholder="Name"
                        className="form-control"
                        onChange={onChangeInfo}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="userTitle">Title</label>
                    <input
                        type="text"
                        id="userTitle"
                        name="title"
                        defaultValue={profile.title}
                        placeholder="Title"
                        className="form-control"
                        onChange={onChangeInfo}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="userLocation">Location</label>
                    <input
                        type="text"
                        id="userLocation"
                        name="location"
                        defaultValue={profile.location}
                        placeholder="Location"
                        className="form-control"
                        onChange={onChangeInfo}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="userIntroduction">About</label>
                    <input
                        type="text"
                        id="userIntroduction"
                        name="introduction"
                        defaultValue={profile.introduction}
                        placeholder="About"
                        className="form-control"
                        onChange={onChangeInfo}
                        required
                    />
                </div>

                <div className="row gutters-sm mt-3">
                    <div className="card h-100">
                        <div className="card-body">
                            <label>Social Links</label>

                            {profile.social_links.map((social) => (
                                <div key={social.id} className="row align-items-center">
                                    <div className="col-auto my-1">
                                        <input
                                            type="text"
                                            name="socialName"
                                            defaultValue={social.name}
                                            placeholder="Social Name"
                                            className="form-control"
                                            onChange={(event) => {social.name=event.target.value}}
                                        />
                                    </div>
                                    <div className="col-auto my-1">
                                        <input
                                            type="text"
                                            name="socialLink"
                                            defaultValue={social.link}
                                            placeholder="Social Link"
                                            className="form-control"
                                            onChange={(event) => {social.link=event.target.value}}
                                        />
                                    </div>
                                    <div className="col-auto my-1">
                                        <button onClick={(event) => deleteSocial(social, event)} className="btn btn-dark">Delete</button>
                                    </div>
                                </div>             
                            ))}

                            <button onClick={addSocialLink} className="btn btn-dark">Add Social Link</button>
                        </div>
                    </div>
                </div>

                <input type="submit" value="Update" className="btn btn-dark mt-3" />
            </form>
        </div>
    )   
}

export default ProfileForm
