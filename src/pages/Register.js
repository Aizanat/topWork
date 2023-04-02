import React, { useState, useEffect } from 'react'
import Amplify, { Auth } from 'aws-amplify'
import Login from './Login'

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

const Register = () => {
  // window.location.href = ' ' //здесь не понимаю как указать))

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

  const signUp = async () => {
    try {
      const user = await Auth.signUp({
        username: state.email,
        password: state.password,
        attributes: {
          email: state.email,
          name: state.username,
        },
      })
      setState((prevState) => ({ ...prevState, stage: 'VERIFYING' }))
    } catch (error) {
      console.log('error signing up:', error)
    }
  }

  const handleEmailChange = (e) => {
    const { value } = e.target
    setState((prevState) => ({ ...prevState, email: value }))
  }
  const handlePasswordChange = (e) => {
    const { value } = e.target
    setState((prevState) => ({ ...prevState, password: value }))
  }

  const handleUserNameChange = (e) => {
    const { value } = e.target
    setState((prevState) => ({ ...prevState, username: value }))
  }

  return (
    <div className="ui container">
      <h1 className="ui header">Register</h1>
      <div className="ui placeholder segment">
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
                display:
                  state.stage === 'SIGNIN' || state.stage === 'SIGNUP'
                    ? 'block'
                    : 'none',
              }}
            >
              <div
                className="field"
                style={{
                  display: state.stage === 'SIGNUP' ? 'block' : 'none',
                }}
              >
                <label>Name</label>
                <div className="ui left icon input">
                  <input
                    type="text"
                    placeholder="John Behr"
                    value={state.username || ''}
                    onChange={handleUserNameChange}
                  />
                  <i className="user icon"></i>
                </div>
              </div>
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
              <div className="field">
                <label>Password</label>
                <div className="ui left icon input">
                  <input type="password" onChange={handlePasswordChange} />
                  <i className="lock icon"></i>
                </div>
              </div>
              <div
                className="ui blue submit button"
                onClick={signUp}
                style={{
                  display: state.stage === 'SIGNUP' ? 'block' : 'none',
                }}
              >
                Sign Up
              </div>
              <p
                className="ui center aligned segment"
                style={{
                  display: state.stage === 'SIGNUP' ? 'block' : 'none',
                }}
              >
                Already have an account?{' '}
                <a href="#" onClick={Login}>
                  {' '}
                  Sign In{' '}
                </a>
              </p>
            </div>
          </div>
          <div className="middle aligned column">
            <div className="App">
              <button
                className="ui google plus button"
                onClick={() => Auth.federatedSignIn({ provider: 'Google' })}
              >
                Continue with Google <i className="google plus icon"></i>
              </button>
            </div>
          </div>
        </div>

        <div
          className="ui vertical divider"
          style={{
            display: state.stage === 'SIGNEDIN' ? 'none' : 'block',
          }}
        >
          Or
        </div>
      </div>
    </div>
  )
}

export default Register
