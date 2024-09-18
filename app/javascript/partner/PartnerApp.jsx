import React from 'react'
import AppProvider from '../context/AppProvider'
import PartnerRoutes from '../routes/partner_index'

const PartnerApp = ({partner}) => <><AppProvider subject='partner' identify={partner}>{PartnerRoutes}</AppProvider></>

export default PartnerApp
