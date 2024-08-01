import React from 'react'
import Routes from '../routes/user_index'
import AppProvider from '../context/AppProvider'

const App = (props) => <><AppProvider subject='user' identify='*'>{Routes}</AppProvider></>

export default App
