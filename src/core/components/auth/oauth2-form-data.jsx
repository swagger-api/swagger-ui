import React from "react"
import PropTypes from "prop-types"

const Oauth2FormData = ({ getComponent, showBasicCreds, showClientID, showClientSecret, username, passwordType }) => {

  const AuthRow = getComponent("AuthRow")

  return (
    <div>
      {
        showBasicCreds &&
        <div>
          <AuthRow> <p>Username: <code>{ username }</code></p> </AuthRow>
          <AuthRow> <p>Password: <code>******</code></p> </AuthRow>
          <AuthRow> <p>Client credentials location: <code>{ passwordType }</code></p> </AuthRow>
        </div>
      }
      { 
        showClientID &&
        <AuthRow> <p>client_id: <code>******</code></p> </AuthRow>
      }
      {
        showClientSecret &&
        <AuthRow> <p>client_secret: <code>******</code></p> </AuthRow>
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