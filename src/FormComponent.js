import React, { useState, useEffect } from 'react'
import Amplify, { Auth } from 'aws-amplify'
import Login from './pages/Login'
import Register from './pages/Register'
import ChangePsw from './pages/ChangePsw'
import SocialMediaAuth from './pages/SocialMediaAuth'
import VerficationCode from './pages/VerificationCode'

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

const FormComponent = () => {
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

  const signOut = async () => {
    try {
      await Auth.signOut()
      window.location.href = '/'
    } catch (error) {
      console.log('error signing out: ', error)
    }
  }

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

  const changePassword = async () => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        return Auth.changePassword(user, state.password, state.new_password)
      })
      .then((data) => console.log(data))
      .catch((error) => console.log(error))
  }

  const changePasswordForgot = async () => {
    Auth.forgotPasswordSubmit(state.email, state.code, state.new_password)
      .then((data) => {
        console.log('SUCCESS')
      })
      .catch((error) => {
        console.log('err', error)
      })
  }

  const resendCode = async () => {
    try {
      await Auth.resendSignUp(state.email)
      console.log('code resent succesfully')
    } catch (error) {
      console.log('error resending code: ', error)
    }
  }

  const sendCode = async () => {
    Auth.forgotPassword(state.email)
      .then((data) => {
        console.log(data)
      })
      .catch((error) => console.log(error))
  }

  const gotoSignUp = () => {
    setState((prevState) => ({ ...prevState, stage: 'SIGNUP' }))
  }
  const gotoSignIn = () => {
    setState((prevState) => ({ ...prevState, stage: 'SIGNIN' }))
  }
  const gotoPasswordRest = () => {
    setState((prevState) => ({ ...prevState, stage: 'FORGOT' }))
  }
  const handleEmailChange = (e) => {
    const { value } = e.target
    setState((prevState) => ({ ...prevState, email: value }))
  }
  const handlePasswordChange = (e) => {
    const { value } = e.target
    setState((prevState) => ({ ...prevState, password: value }))
  }
  const handleNewPasswordChange = (e) => {
    const { value } = e.target
    setState((prevState) => ({ ...prevState, new_password: value }))
  }
  const handleCodeChange = (e) => {
    const { value } = e.target
    setState((prevState) => ({ ...prevState, code: value }))
  }
  const handleUserNameChange = (e) => {
    const { value } = e.target
    setState((prevState) => ({ ...prevState, username: value }))
  }

  return (
    <div className="ui container">
      <h1 className="ui header">Cognito Auth</h1>
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
                <label>Old Password</label>
                <div className="ui left icon input">
                  <input
                    type="password"
                    value={state.password || ''}
                    onChange={handlePasswordChange}
                  />
                  <i className="lock icon"></i>
                </div>
              </div>
              <div className="ui blue submit button" onClick={changePassword}>
                Change Password
              </div>
              <br />
              <div className="ui blue submit button" onClick={signOut}>
                SignOut
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
                display: state.stage === 'SIGNIN' || state.stage === 'SIGNUP',
              }}
            >
              <VerficationCode
                confirm={confirm}
                resendCode={resendCode}
                handleCodeChange={handleCodeChange}
                visible={state.stage === 'VERIFYING'}
                codeValue={state.code || ''}
              />
              <ChangePsw
                sendCode={sendCode}
                changePasswordForgot={changePasswordForgot}
                handleNewPasswordChange={handleNewPasswordChange}
                handleEmailChange={handleEmailChange}
                handleCodeChange={handleCodeChange}
                visible={state.stage === 'FORGOT'}
                emailValue={state.email || ''}
                codeValue={state.code || ''}
              />
              <Register
                signUp={signUp}
                handleUserNameChange={handleUserNameChange}
                handleEmailChange={handleEmailChange}
                handlePasswordChange={handlePasswordChange}
                visible={state.stage === 'SIGNUP'}
                emailValue={state.email || ''}
              />
              <Login
                signIn={signIn}
                handleEmailChange={handleEmailChange}
                handlePasswordChange={handlePasswordChange}
                visible={state.stage === 'SIGNIN'}
                emailValue={state.email || ''}
              />
              <p
                className="ui center aligned segment"
                style={{
                  display: state.stage === 'SIGNIN' ? 'block' : 'none',
                }}
              >
                Don't have an account?
                <a href="#" onClick={gotoSignUp}>
                  Sign Up
                </a>
              </p>
              <p
                className="ui center aligned segment"
                style={{
                  display: state.stage === 'SIGNIN' ? 'block' : 'none',
                }}
              >
                <a href="#" onClick={gotoPasswordRest}>
                  Forgot your password?
                </a>
              </p>
              <p
                className="ui center aligned segment"
                style={{
                  display: state.stage === 'SIGNUP' ? 'block' : 'none',
                }}
              >
                Already have an account?
                <a href="#" onClick={gotoSignIn}>
                  Sign In
                </a>
              </p>
            </div>
          </div>

          <SocialMediaAuth />
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

export default FormComponent
