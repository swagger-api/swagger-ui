import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

const AuthHttpBasic = ({ getComponent, name, schema, isAuthorized, authorizedUsername, onChange }) => {
  const AuthFormRow = getComponent("AuthFormRow")
  const Markdown = getComponent( "Markdown" )
  const JumpToPath = getComponent("JumpToPath", true)
  const Input = getComponent("Input")

  return (
    <div>
      <div className="auth__header">
        <h4>
          <code>{ name }</code>&nbsp;
          (http, Basic)
          <JumpToPath path={[ "securityDefinitions", name ]} />
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
            <AuthFormRow label="Username:" htmlFor="basic-html-auth-username">
              <Input id="basic-html-auth-username" type="text" required="required" name="username" onChange={ onChange }/>
            </AuthFormRow>
            <AuthFormRow label="Password:" htmlFor="basic-html-auth-password">
              <Input id="basic-html-auth-password" type="password" required="required" name="password" autoComplete="new-password" onChange={ onChange }/>
            </AuthFormRow>
          </div>
      }
    </div>
  )
}

AuthHttpBasic.propTypes = {
  getComponent: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  schema: ImPropTypes.map.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  authorizedUsername: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default AuthHttpBasic