import React, { useEffect, useState } from "react"
import { useAppContext } from "../context/AppProvider"
import SingleFileUploader from "./SingleFileUploader"
import usePathFinder from "../hooks/usePathFinder"
import useApi from "../hooks/useApi"
import DefaultAvatar from "./icons/DefaultAvatar"

const PartnerSettings = () => {
    const { auth, RequireAuthorizedApi } = useAppContext()
    const { QueryApi } = useApi()
    const { partnerApiUrl, partnerUpdateApiUrl } = usePathFinder()
    const [partner, setPartner] = useState({edit: false})
    const updateFormData = new FormData()

    const setEditMode = (event) => {
        event.preventDefault()

        setPartner({
            ...partner,
            edit: true
        })
    }

    const updateLogo = (image) => {
        updateFormData.set(`partner[logo]`, image)
    }

    const onChangeInfo = (event) => {
        updateFormData.set(`partner[${event.target.name}]`, event.target.value)
    }

    const updateSubmit = async (event) => {
        event.preventDefault()

        RequireAuthorizedApi('PUT', partnerUpdateApiUrl, updateFormData)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                } else if (response.status == 401) {
                    navigate('/auth/login')
                    return
                }

                throw new Error('Something went wrong!')
            })
            .then((partnerResponse) => {
                setPartner({
                    ...partner,
                    ...partnerResponse,
                    edit: false
                })
            })
            .catch((error) => {
            })
    }

    useEffect(() => {
        QueryApi(partnerApiUrl, {}, {'X-Auth-Token': auth.info.token})
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }

                throw new Error('Something went wrong!')
            })
            .then((partnerResponse) => {
                setPartner({
                    ...partner,
                    ...partnerResponse
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    return (
        partner.edit ? (
            <form onSubmit={updateSubmit} data-testid="update-partner-form">
                <div className="form-group">
                <label htmlFor="partnerLogo">Logo</label>
                    <SingleFileUploader
                        id="logo-dropzone"
                        acceptedFiles="image/jpeg,image/png"
                        maxFilesize={256}
                        file={partner.logo}
                        uploadedFile={(imageBlobSignedId) => {
                            updateLogo(imageBlobSignedId)
                        }}
                        unloadedFile={_ => {
                            updateLogo('')
                        }}
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="partnerName">Name</label>
                    <input
                        type="text"
                        id="partnerName"
                        name="name"
                        defaultValue={partner.name}
                        placeholder="Name"
                        className="form-control"
                        onChange={onChangeInfo}
                    />
                </div>

                <input type="submit" value="Update" className="btn btn-dark mt-3" />
            </form>   
        ) : (
            <div className="d-flex flex-column align-items-center">
                {partner.logo?.url ? (
                    <img src={partner.logo?.url} className="rounded-circle" width={150} />
                ) : (
                    <DefaultAvatar size={150} />
                )}
                <h6>{partner.name}</h6>
                {partner.can_edit && <button onClick={setEditMode} className="btn btn-dark">Edit</button>}
            </div>
        )
    )
}

export default PartnerSettings
