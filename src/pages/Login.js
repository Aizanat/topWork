import React from 'react'

const Login = (props) => {
  return (
    <div
      className="ui blue submit button"
      onClick={props.signIn}
      style={{
        display: props.visible ? 'block' : 'none',
      }}
    >
      Sign In
    </div>
  )
}

export default Login
