import React from "react"
import PropTypes from "prop-types"

const AuthHttpBasic = ({getComponent, name, schema, value, onChange}) => {
  const AuthFormRow = getComponent("AuthFormRow")
  const Markdown = getComponent( "Markdown" )
  const JumpToPath = getComponent("JumpToPath", true)
  const Input = getComponent("Input")

  const username = value ? value.get("username") : null

  return (
    <div>
      <div className="auth__header">
        <h4>
          <code>{ name || schema.get("name") }</code>&nbsp;
          (http, Basic)
          <JumpToPath path={[ "securityDefinitions", name ]} />
        </h4>
      </div>

      { username && <div className="auth__row">
          <h6>Authorized</h6>
        </div> 
      }

      <div className="auth__row">
        <Markdown source={ schema.get("description") } />
      </div>

      {
        username
        ? <div>
            <div className="auth__row">
              <p>Username: <code>{ username }</code></p>
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
  name: PropTypes.string,
  schema: PropTypes.object,
  value: PropTypes.string,
  onChange: PropTypes.func
}

export default AuthHttpBasic