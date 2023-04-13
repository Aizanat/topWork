import React from 'react'

const Login = (props) => {
  return (
    <>
      <div
        className="field"
        style={{
          display: props.visible ? 'block' : 'none',
        }}
      >
        <div className="field">
          <label>Email</label>
          <div className="ui left icon input">
            <input
              type="text"
              placeholder="Email"
              value={props.emailValue}
              onChange={props.handleEmailChange}
            />
            <i className="mail icon"></i>
          </div>
        </div>
        <div className="field">
          <label>Password</label>
          <div className="ui left icon input">
            <input type="password" onChange={props.handlePasswordChange} />
            <i className="lock icon"></i>
          </div>
        </div>
      </div>

      <div
        className="ui blue submit button"
        onClick={props.signIn}
        style={{
          display: props.visible ? 'block' : 'none',
        }}
      >
        Sign In
      </div>
    </>
  )
}

export default Login
