import React from "react"
import PropTypes from "prop-types"

const Oauth2FormData = ({ showBasicCreds, showClientID, showClientSecret, username, passwordType }) => {

  return (
    <div>
      {
        showBasicCreds &&
        <div>
          <div className="auth__row"> <p>Username: <code>{ username }</code></p> </div>
          <div className="auth__row"> <p>Password: <code>******</code></p> </div>
          <div className="auth__row"> <p>Client credentials location: <code>{ passwordType }</code></p> </div>
        </div>
      }
      { 
        showClientID &&
        <div className="auth__row"> <p>client_id: <code>******</code></p> </div>
      }
      {
        showClientSecret &&
        <div className="auth__row"> <p>client_secret: <code>******</code></p> </div>
      }

    </div>
  )
}

Oauth2FormData.propTypes = {
  getComponent: PropTypes.func.isRequired,
  showBasicCreds: PropTypes.bool,
  showClientID: PropTypes.bool,
  showClientSecret: PropTypes.bool,
  username: PropTypes.string,
  passwordType: PropTypes.string
}

export default Oauth2FormData