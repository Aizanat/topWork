import React from 'react'
import { Routes, Route } from 'react-router-dom'
import FormComponent from './FormComponent'
import SocialMediaAuth from './pages/SocialMediaAuth'
import Authorized from './pages/Authorized'
import Error from './pages/Error'

function App() {
  return (
    <div className="ui masthead vertical segment">
      <Routes>
        <Route path="/" element={<FormComponent />}></Route>
        <Route path="/socialMedia" element={<SocialMediaAuth />}></Route>
        <Route path="/authorized" element={<Authorized />}></Route>
        <Route path="/404" element={<Error />}></Route>
      </Routes>
    </div>
  )
}

export default App
