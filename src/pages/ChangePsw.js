import React from 'react'

const ChangePsw = (props) => {
  return (
    <div
      className="ui form testchangepassword"
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
      <div className="ui blue submit button" onClick={props.sendCode}>
        Send Email
      </div>
      <br />
      <div className="field">
        <label>Verfication Code</label>
        <div className="ui left icon input">
          <input
            type="text"
            placeholder="111111"
            value={props.codeValue}
            onChange={props.handleCodeChange}
          />
          <i className="key icon"></i>
        </div>
      </div>
      <div className="field">
        <label>New Password</label>
        <div className="ui left icon input">
          <input type="password" onChange={props.handleNewPasswordChange} />
          <i className="lock icon"></i>
        </div>
      </div>
      <div
        className="ui blue submit button"
        onClick={props.changePasswordForgot}
      >
        Change Password
      </div>
    </div>
  )
}

export default ChangePsw
