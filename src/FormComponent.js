import React, { useState, useEffect } from 'react'
import Amplify, { Auth } from 'aws-amplify'

// ES Modules, e.g. transpiling with Babel

const USER_POOL_ID = 'us-east-1_Dw1zhzA7F'
const USER_POOL_WEB_CLIENT_ID = '10l0p0blh550oasf9orjbbaoe1'
const REGION = 'us-east-1'
const COOKIE_DOMAIN = 'localhost'
const OAUTH_DOMAIN = 'users-list.auth.us-east-1.amazoncognito.com'

// For more options, check out this link https://docs.amplify.aws/lib/auth/start/q/platform/js#re-use-existing-authentication-resource
Amplify.configure({
  Auth: {
    authenticationFlowType: 'USER_SRP_AUTH',
    region: REGION,
    userPoolId: USER_POOL_ID,
    userPoolWebClientId: USER_POOL_WEB_CLIENT_ID,
    mandatorySignIn: false,
    // OPTIONAL - Configuration for cookie storage
    // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
    cookieStorage: {
      // REQUIRED - Cookie domain (only required if cookieStorage is provided)
      domain: COOKIE_DOMAIN,
      // OPTIONAL - Cookie path
      path: '/',
      // OPTIONAL - Cookie expiration in days
      expires: 365,
      // OPTIONAL - Cookie secure flag
      // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
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
        setState({ stage: 'SIGNEDIN', cognito_username: user.username })
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
          email: state.email, // optional
          name: state.username,
        },
      })
      setState({ stage: 'VERIFYING' })
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
      //here we should add token to LocalStorage
      setState({ stage: 'SIGNEDIN', cognito_username: user.username })
    } catch (error) {
      console.log('error signing in', error)
      if (error.code === 'UserNotConfirmedException') {
        await Auth.resendSignUp(state.email)
        setState({ stage: 'VERIFYING' })
      }
    }
  }

  const confirm = async () => {
    console.log(state.code)
    let username = state.email
    let code = state.code
    try {
      await Auth.confirmSignUp(username, code)
      //바로로그인?
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
    setState({ stage: 'SIGNUP' })
  }
  const gotoSignIn = () => {
    setState({ stage: 'SIGNIN' })
  }
  const gotoPasswordRest = () => {
    setState({ stage: 'FORGOT' })
  }
  const handleEmailChange = (e) => {
    setState({ email: e.target.value })
  }
  const handlePasswordChange = (e) => {
    setState({ password: e.target.value })
  }
  const handleNewPasswordChange = (e) => {
    setState({ new_password: e.target.value })
  }
  const handleCodeChange = (e) => {
    setState({ code: e.target.value })
  }
  const handleUserNameChange = (e) => {
    setState({ username: e.target.value })
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
                  <input type="password" onChange={handlePasswordChange} />
                  <i className="lock icon"></i>
                </div>
              </div>
              <div className="field">
                <label>New Password</label>
                <div className="ui left icon input">
                  <input type="password" onChange={handleNewPasswordChange} />
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
                onClick={signIn}
                style={{
                  display: state.stage === 'SIGNIN' ? 'block' : 'none',
                }}
              >
                Sign In
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
                  display: state.stage === 'SIGNIN' ? 'block' : 'none',
                }}
              >
                Don't have an account?{' '}
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
                Already have an account?{' '}
                <a href="#" onClick={gotoSignIn}>
                  Sign In
                </a>{' '}
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

export default FormComponent
