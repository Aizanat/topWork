import React, { useState, useEffect } from 'react'
import Amplify, { Auth } from 'aws-amplify'

const USER_POOL_ID = 'us-east-1_Dw1zhzA7F'
const USER_POOL_WEB_CLIENT_ID = '10l0p0blh550oasf9orjbbaoe1'
const REGION = 'us-east-1'
const COOKIE_DOMAIN = 'localhost'
const OAUTH_DOMAIN = 'users-list.auth.us-east-1.amazoncognito.com'

Amplify.configure({
  Auth: {
    authenticationFlowType: 'USER_SRP_AUTH',
    region: REGION,
    userPoolId: USER_POOL_ID,
    userPoolWebClientId: USER_POOL_WEB_CLIENT_ID,
    mandatorySignIn: false,
    cookieStorage: {
      domain: COOKIE_DOMAIN,
      path: '/',
      expires: 365,
      secure: false,
    },

    oauth: {
      domain: OAUTH_DOMAIN,
      scope: ['email', 'openid', 'profile'],
      redirectSignIn: 'http://localhost:3000',
      redirectSignOut: 'http://localhost:3000',
      responseType: 'token',
    },
  },
})

const ChangePsw = () => {
  const [state, setState] = useState({
    username: '',
    email: '',
    password: '',
    new_password: '',
    code: '',
    stage: 'SIGNIN',
    cognito_username: '',
  })
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        console.log(user)
        setState((prevState) => ({
          ...prevState,
          stage: 'SIGNEDIN',
          cognito_username: user.username,
        }))
        console.log(user.signInUserSession.accessToken.jwtToken)
      })
      .catch(() => {
        console.log('Not signed in')
      })
  }, [])

  const changePasswordForgot = async () => {
    Auth.forgotPasswordSubmit(state.email, state.code, state.new_password)
      .then((data) => {
        console.log('SUCCESS')
      })
      .catch((error) => {
        console.log('err', error)
      })
  }

  const sendCode = async () => {
    Auth.forgotPassword(state.email)
      .then((data) => {
        console.log(data)
      })
      .catch((error) => console.log(error))
  }

  const gotoPasswordRest = () => {
    setState((prevState) => ({ ...prevState, stage: 'FORGOT' }))
  }

  const handleEmailChange = (e) => {
    const { value } = e.target
    setState((prevState) => ({ ...prevState, email: value }))
  }

  const handleNewPasswordChange = (e) => {
    const { value } = e.target
    setState((prevState) => ({ ...prevState, new_password: value }))
  }

  const handleCodeChange = (e) => {
    const { value } = e.target
    setState((prevState) => ({ ...prevState, code: value }))
  }

  return (
    <div className="ui container">
      <h1 className="ui header">ChangePsw</h1>
      <div className="ui placeholder segment">
        <div
          className="ui one column very relaxed stackable grid"
          style={{
            display: state.stage === 'SIGNEDIN' ? 'block' : 'none',
          }}
        >
          <div className="column">
            <div className="ui form">
              <p className="ui center aligned segment">
                cognito username : {state.cognito_username}
              </p>
              <div className="field">
                <label>New Password</label>
                <div className="ui left icon input">
                  <input type="password" onChange={handleNewPasswordChange} />
                  <i className="lock icon"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="ui two column very relaxed stackable grid"
          style={{
            display: state.stage === 'SIGNEDIN' ? 'none' : 'block',
          }}
        >
          <div className="column">
            <div
              className="ui form"
              style={{
                display: state.stage === 'VERIFYING' ? 'block' : 'none',
              }}
            ></div>
            <div
              className="ui form"
              style={{
                display: state.stage === 'FORGOT' ? 'block' : 'none',
              }}
            >
              <div className="field">
                <label>Email</label>
                <div className="ui left icon input">
                  <input
                    type="text"
                    placeholder="Email"
                    value={state.email || ''}
                    onChange={handleEmailChange}
                  />
                  <i className="mail icon"></i>
                </div>
              </div>
              <div className="ui blue submit button" onClick={sendCode}>
                {' '}
                Send Email
              </div>
              <br />
              <div className="field">
                <label>Verfication Code</label>
                <div className="ui left icon input">
                  <input
                    type="text"
                    placeholder="111111"
                    value={state.code || ''}
                    onChange={handleCodeChange}
                  />
                  <i className="key icon"></i>
                </div>
              </div>
              <div className="field">
                <label>New Password</label>
                <div className="ui left icon input">
                  <input type="password" onChange={handleNewPasswordChange} />
                  <i className="lock icon"></i>
                </div>
              </div>
              <div
                className="ui blue submit button"
                onClick={changePasswordForgot}
              >
                {' '}
                Change Password
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangePsw
