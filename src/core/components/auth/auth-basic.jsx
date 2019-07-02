import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

const BasicAuth = ({ schema, getComponent, name, onChange, isAuthorized, authorizedUsername }) => {
  
  const Input = getComponent("Input")
  const AuthFormRow = getComponent("AuthFormRow")
  const JumpToPath = getComponent("JumpToPath", true)
  const Markdown = getComponent( "Markdown" )

  return (
    <div>
      <div className="auth__header">
        <h4>
          Basic authorization<JumpToPath path={[ "securityDefinitions", name ]} />
        </h4>
      </div>

      { isAuthorized && <div className="auth__row">
          <h6>Authorized</h6>
        </div>
      }

      <div className="auth__row">
        <Markdown source={ schema.get("description") } />
      </div>

      {
        isAuthorized
        ? <div>
            <div className="auth__row">
              <p>Username: <code>{ authorizedUsername }</code></p>
            </div>
            <div className="auth__row">
              <p>Password: <code>******</code></p>
            </div>
          </div>
        : <div>
            <AuthFormRow label="Username:" htmlFor="basic-auth-username">
              <Input id="basic-auth-username" type="text" required="required" name="username" onChange={ onChange }/>
            </AuthFormRow>
            <AuthFormRow label="Password:" htmlFor="basic-auth-password">
              <Input id="basic-auth-password" type="password" required="required" name="password" autoComplete="new-password" onChange={ onChange }/>
            </AuthFormRow>
          </div>
      }
    </div>
  )
}

BasicAuth.propTypes = {
  name: PropTypes.string.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  authorizedUsername: PropTypes.string.isRequired,
  getComponent: PropTypes.func.isRequired,
  schema: ImPropTypes.map.isRequired,
  onChange: PropTypes.func.isRequired
}

export default BasicAuth