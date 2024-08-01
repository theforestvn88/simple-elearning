import React from 'react'
import AppProvider from '../context/AppProvider'
import PartnerRoutes from '../routes/partner_index'

const PartnerApp = ({partner}) => <><AppProvider subject='instructor' identify={partner}>{PartnerRoutes}</AppProvider></>

export default PartnerApp
