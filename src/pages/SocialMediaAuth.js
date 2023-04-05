import React from 'react'
import Auth from 'aws-amplify'

const SocialMediaAuth = () => {
  return (
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
  )
}

export default SocialMediaAuth
