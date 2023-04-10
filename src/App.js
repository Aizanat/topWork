import React from 'react'
import { Routes, Route } from 'react-router-dom'
import FormComponent from './FormComponent'
import Login from './pages/Login'
import Register from './pages/Register'
import ChangePsw from './pages/ChangePsw'
import VerficationCode from './pages/VerificationCode'
import SocialMediaAuth from './pages/SocialMediaAuth'
import Authorized from './pages/Authorized'

function App() {
  return (
    <div className="ui masthead vertical segment">
      <Routes>
        <Route path="/" element={<FormComponent />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signIn" element={<VerficationCode />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/changePsw" element={<ChangePsw />}></Route>
        <Route path="/socialMedia" element={<SocialMediaAuth />}></Route>
        <Route path="/authorized" element={<Authorized />}></Route>
      </Routes>
    </div>
  )
}

export default App
