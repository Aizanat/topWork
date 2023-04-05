import React from 'react'

const VerficationCode = (props) => {
  return (
    <div
      className="ui form"
      style={{
        display: props.visible ? 'block' : 'none',
      }}
    >
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
      <div className="ui blue submit button" onClick={props.confirm}>
        Confirm Account
      </div>
      <p className="ui center aligned segment">
        Didn't receive a code?
        <a href="#" onClick={props.resendCode}>
          Resend it
        </a>
      </p>
    </div>
  )
}

export default VerficationCode
