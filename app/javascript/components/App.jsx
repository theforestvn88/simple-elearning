import React from 'react'
import Routes from '../routes'
import AppProvider from '../context/AppProvider'

const App = (props) => <><AppProvider>{Routes}</AppProvider></>

export default App
