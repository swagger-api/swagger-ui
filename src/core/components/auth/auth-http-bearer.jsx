import React from "react"
import PropTypes from "prop-types"

const AuthHttpBearer = ({getComponent, name, schema, value, errors, onChange}) => {
  const AuthFormRow = getComponent("AuthFormRow")
  const AuthError = getComponent("authError")
  const Markdown = getComponent( "Markdown" )
  const JumpToPath = getComponent("JumpToPath", true)
  const Input = getComponent("Input")

  return (
    <div>
      <div className="auth__header">
        <h4>
          <code>{ name || schema.get("name") }</code>&nbsp;
          (http, Bearer)
          <JumpToPath path={[ "securityDefinitions", name ]} />
        </h4>
      </div>

      { value && <div className="auth__row">
          <h6>Authorized</h6>
        </div>
      }

      <div className="auth__row">
        <Markdown source={ schema.get("description") } />
      </div>

      { value
        ? <div className="auth__row">
            <p>Value: <code>******</code></p>
          </div>
        : <AuthFormRow label="Username:" htmlFor="bearer-html-auth-value">
            <Input id="bearer-html-auth-value" type="text" onChange={ onChange }/>
          </AuthFormRow>
      }

      {
        errors.valueSeq().map( (error, key) => {
          return <AuthError error={ error }
            key={ key }/>
        } )
      }
    </div>
  )
}

AuthHttpBearer.propTypes = {
  getComponent: PropTypes.func.isRequired,
  name: PropTypes.string,
  schema: PropTypes.object,
  value: PropTypes.string,
  errors: PropTypes.object,
  onChange: PropTypes.func
}

export default AuthHttpBearer