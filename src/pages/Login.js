import React, { useState, useEffect } from 'react'
import Amplify, { Auth } from 'aws-amplify'
import Register from './Register'
import ChangePsw from './ChangePsw'

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

const Login = () => {
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

  const signIn = async () => {
    try {
      const user = await Auth.signIn({
        username: state.email,
        password: state.password,
      })
      console.log(user)
      setState((prevState) => ({
        ...prevState,
        stage: 'SIGNEDIN',
        cognito_username: user.username,
      }))
    } catch (error) {
      console.log('error signing in', error)
      if (error.code === 'UserNotConfirmedException') {
        await Auth.resendSignUp(state.email)
        setState((prevState) => ({ ...prevState, stage: 'VERIFYING' }))
      }
    }
  }

  const confirm = async () => {
    console.log(state.code)
    let username = state.email
    let code = state.code
    try {
      await Auth.confirmSignUp(username, code)
      signIn()
    } catch (error) {
      console.log('error confirming sign up', error)
    }
  }

  const resendCode = async () => {
    try {
      await Auth.resendSignUp(state.email)
      console.log('code resent succesfully')
    } catch (error) {
      console.log('error resending code: ', error)
    }
  }

  const gotoSignIn = () => {
    setState((prevState) => ({ ...prevState, stage: 'SIGNIN' }))
  }

  const handleEmailChange = (e) => {
    const { value } = e.target
    setState((prevState) => ({ ...prevState, email: value }))
  }
  const handlePasswordChange = (e) => {
    const { value } = e.target
    setState((prevState) => ({ ...prevState, password: value }))
  }

  const handleCodeChange = (e) => {
    const { value } = e.target
    setState((prevState) => ({ ...prevState, code: value }))
  }

  return (
    <div className="ui container">
      <h1 className="ui header">Login</h1>
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
                display: state.stage === 'VERIFYING' ? 'block' : 'none',
              }}
            >
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
              <div className="ui blue submit button" onClick={confirm}>
                Confirm Account
              </div>
              <p className="ui center aligned segment">
                Didn't receive a code?{' '}
                <a href="#" onClick={resendCode}>
                  Resend it
                </a>
              </p>
            </div>
            <div
              className="ui form"
              style={{
                display:
                  state.stage === 'SIGNIN' || state.stage === 'SIGNUP'
                    ? 'block'
                    : 'none',
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

              <div className="field">
                <label>Password</label>
                <div className="ui left icon input">
                  <input type="password" onChange={handlePasswordChange} />
                  <i className="lock icon"></i>
                </div>
              </div>

              <div
                className="ui blue submit button"
                onClick={signIn}
                style={{
                  display: state.stage === 'SIGNIN' ? 'block' : 'none',
                }}
              >
                Sign In
              </div>
              <p
                className="ui center aligned segment"
                style={{
                  display: state.stage === 'SIGNIN' ? 'block' : 'none',
                }}
              >
                Don't have an account?{' '}
                <a href="#" onClick={Register}>
                  {' '}
                  Sign Up{' '}
                </a>
              </p>
              <p
                className="ui center aligned segment"
                style={{
                  display: state.stage === 'SIGNIN' ? 'block' : 'none',
                }}
              >
                <a href="#" onClick={ChangePsw}>
                  Forgot your password?
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

export default Login
