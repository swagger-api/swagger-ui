import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

const AuthHttpBearer = ({ getComponent, name, schema, isAuthorized, onChange }) => {
  const AuthFormRow = getComponent("AuthFormRow")
  const Markdown = getComponent( "Markdown" )
  const JumpToPath = getComponent("JumpToPath", true)
  const Input = getComponent("Input")

  return (
    <div>
      <div className="auth__header">
        <h4>
          <code>{ name }</code>&nbsp;
          (http, Bearer)
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

      { isAuthorized
        ? <div className="auth__row">
            <p>Value: <code>******</code></p>
          </div>
        : <AuthFormRow label="Username:" htmlFor="bearer-html-auth-value">
            <Input id="bearer-html-auth-value" type="text" onChange={ onChange }/>
          </AuthFormRow>
      }
    </div>
  )
}

AuthHttpBearer.propTypes = {
  getComponent: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  schema: ImPropTypes.map.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
}

export default AuthHttpBearer