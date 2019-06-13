import React from "react"
import PropTypes from "prop-types"

const Oauth2Form = ({
  getComponent,
  showBasicCreds,
  showClientID,
  showClientSecret,
  showScopes,
  scopes,
  scopeName,
  clientId,
  clientIdRequired,
  clientSecret,
  flow,
  onInputChange,
  onScopeChange}) => {

  const AuthFormRow = getComponent("AuthFormRow")
  const Input = getComponent("Input")
  const DropDown = getComponent("DropDown")
  const DropDownItem = getComponent("DropDownItem")
	
  return (
    <div>
      {
        showBasicCreds &&
        <div>
          <AuthFormRow label="Username:" htmlFor="oauth_username">
            <Input id="oauth_username" type="text" data-name="username" onChange={ onInputChange }/>
          </AuthFormRow>
          <AuthFormRow label="Password:" htmlFor="oauth_password">
            <Input id="oauth_password" type="password" data-name="password" onChange={ onInputChange }/>
          </AuthFormRow>
          <AuthFormRow label="Client credentials location:" htmlFor="password_type">
            <DropDown id="password_type" onChange={ onInputChange } value="basic" data-name="passwordType">
              <DropDownItem value="basic">Authorization header</DropDownItem>
              <DropDownItem value="request-body">Request body</DropDownItem>
            </DropDown>
          </AuthFormRow>
        </div>
      }
      { 
        showClientID &&
        <AuthFormRow label="client_id:" htmlFor="client_id">
          <Input id="client_id"
              type="text"
              required={ clientIdRequired }
              value={ clientId }
              data-name="clientId"
              onChange={ onInputChange }/>
        </AuthFormRow>
      }
      {
        showClientSecret &&
        <AuthFormRow label="client_secret:" htmlFor="client_secret">
            <Input id="client_secret"
                value={ clientSecret }
                type="text"
                data-name="clientSecret"
                onChange={ onInputChange }/>
          </AuthFormRow>
      }
      {
        showScopes &&
        <AuthFormRow label="Scopes:" mod="scopes">
            <div>
              { scopes.map((description, name) => {
                return (
                  <div key={ name }>
                    <div className="checkbox">
                      <Input data-value={ name }
                            id={`${name}-${flow}-checkbox-${scopeName}`}
                            type="checkbox"
                            onChange={ onScopeChange }/>
                          <label htmlFor={`${name}-${flow}-checkbox-${scopeName}`}>
                            <span className="item"></span>
                            <div className="text">
                              <p className="name">{name}</p>
                              <p className="description">{description}</p>
                            </div>
                          </label>
                    </div>
                  </div>
                )
                }).toArray()
              }
            </div>
          </AuthFormRow>
      }
    </div>
  )
}

Oauth2Form.propTypes = {
  getComponent: PropTypes.func.isRequired,
  showBasicCreds: PropTypes.bool,
  showClientID: PropTypes.bool,
	showClientSecret: PropTypes.bool,
	showScopes: PropTypes.bool,
	scopes: PropTypes.object,
  scopeName: PropTypes.string,
	clientId: PropTypes.string,
	clientIdRequired: PropTypes.bool,
	clientSecret: PropTypes.string,
	flow: PropTypes.string,
	onInputChange: PropTypes.func,
	onScopeChange: PropTypes.func
}

export default Oauth2Form