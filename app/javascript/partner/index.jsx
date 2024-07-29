import React from 'react'
import { createRoot } from 'react-dom/client'
import PartnerApp from './PartnerApp'


document.addEventListener('DOMContentLoaded', (event) => {
  const container = document.getElementById('app')
  const root = createRoot(container)
  root.render(<PartnerApp />)
})