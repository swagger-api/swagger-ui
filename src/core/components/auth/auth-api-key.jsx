import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"


const ApiKeyAuth = ({ schema, getComponent, name, onChange, isAuthorized }) => {

  const Input = getComponent("Input")
  const AuthFormRow = getComponent("AuthFormRow")
  const Markdown = getComponent( "Markdown" )
  const JumpToPath = getComponent("JumpToPath", true)

  return (
    <div>
      <div className="auth__header">
        <h4>
          <code>{ name }</code>&nbsp;
          (apiKey)
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

      <div className="auth__row">
        <p>Name: <code>{ schema.get("name") }</code></p>
      </div>

      <div className="auth__row">
        <p>In: <code>{ schema.get("in") }</code></p>
      </div>

      
      { isAuthorized
        ? <div className="auth__row">
            <p>Value: <code>******</code></p>
          </div>
        : <AuthFormRow label="Value:" htmlFor="api-key-value">
            <Input id="api-key-value" type="text" onChange={ onChange }/>
          </AuthFormRow>
      }
    </div>
  )
}

ApiKeyAuth.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  getComponent: PropTypes.func.isRequired,
  schema: ImPropTypes.map.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func
}

export default ApiKeyAuth