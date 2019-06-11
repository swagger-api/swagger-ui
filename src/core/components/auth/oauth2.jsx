import React from "react"
import PropTypes from "prop-types"
import oauth2Authorize from "core/oauth2-authorize"

export default class Oauth2 extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    authorized: PropTypes.object,
    getComponent: PropTypes.func.isRequired,
    schema: PropTypes.object.isRequired,
    authSelectors: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
    errSelectors: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    errActions: PropTypes.object.isRequired,
    getConfigs: PropTypes.any
  }

  constructor(props, context) {
    super(props, context)
    let { name, schema, authorized, authSelectors } = this.props
    let auth = authorized && authorized.get(name)
    let authConfigs = authSelectors.getConfigs() || {}
    let username = auth && auth.get("username") || ""
    let clientId = auth && auth.get("clientId") || authConfigs.clientId || ""
    let clientSecret = auth && auth.get("clientSecret") || authConfigs.clientSecret || ""
    let passwordType = auth && auth.get("passwordType") || "basic"

    this.state = {
      appName: authConfigs.appName,
      name: name,
      schema: schema,
      scopes: [],
      clientId: clientId,
      clientSecret: clientSecret,
      username: username,
      password: "",
      passwordType: passwordType
    }
  }

  close = (e) => {
    e.preventDefault()
    let { authActions } = this.props

    authActions.showDefinitions(false)
  }

  authorize =() => {
    let { authActions, errActions, getConfigs, authSelectors } = this.props
    let configs = getConfigs()
    let authConfigs = authSelectors.getConfigs()

    errActions.clear({authId: name,type: "auth", source: "auth"})
    oauth2Authorize({auth: this.state, authActions, errActions, configs, authConfigs })
  }

  onScopeChange =(e) => {
    let { target } = e
    let { checked } = target
    let scope = target.dataset.value

    if ( checked && this.state.scopes.indexOf(scope) === -1 ) {
      let newScopes = this.state.scopes.concat([scope])
      this.setState({ scopes: newScopes })
    } else if ( !checked && this.state.scopes.indexOf(scope) > -1) {
      this.setState({ scopes: this.state.scopes.filter((val) => val !== scope) })
    }
  }

  onInputChange =(e) => {
    const value = e.value || e.target.value
    const name = e.name || e.target.dataset.name

    let state = {
      [name]: value
    }

    this.setState(state)
  }

  logout =(e) => {
    e.preventDefault()
    let { authActions, errActions, name } = this.props

    errActions.clear({authId: name, type: "auth", source: "auth"})
    authActions.logout([ name ])
  }

  render() {
    let {
      schema, getComponent, authSelectors, errSelectors, name, specSelectors
    } = this.props
    const Input = getComponent("Input")
    const Button = getComponent("Button")
    const AuthError = getComponent("authError")
    const JumpToPath = getComponent("JumpToPath", true)
    const Markdown = getComponent( "Markdown" )
    const DropDown = getComponent("DropDown")
    const DropDownItem = getComponent("DropDownItem")

    const { isOAS3 } = specSelectors

    // Auth type consts
    const IMPLICIT = "implicit"
    const PASSWORD = "password"
    const ACCESS_CODE = isOAS3() ? "authorizationCode" : "accessCode"
    const APPLICATION = isOAS3() ? "clientCredentials" : "application"

    let flow = schema.get("flow")
    let scopes = schema.get("allowedScopes") || schema.get("scopes")
    let authorizedAuth = authSelectors.authorized().get(name)
    let isAuthorized = !!authorizedAuth
    let errors = errSelectors.allErrors().filter( err => err.get("authId") === name)
    let isValid = !errors.filter( err => err.get("source") === "validation").size
    let description = schema.get("description")

    return (
      <div>
        <div className="auth__header">
          <h4>{name} (OAuth2, { schema.get("flow") }) <JumpToPath path={[ "securityDefinitions", name ]} /></h4>
        </div>

        { !this.state.appName 
          ? null 
          : <div className="auth__row">
              <h5>Application: { this.state.appName } </h5>
            </div> 
        }

        { description && <div className="auth__row">
            <Markdown source={description} />
          </div> 
        }

        { isAuthorized && <div className="auth__row">
            <h6>Authorized</h6>
          </div> }

        { ( flow === IMPLICIT || flow === ACCESS_CODE ) && <div className="auth__row">
          <p>Authorization URL: <code>{ schema.get("authorizationUrl") }</code></p>
          </div>
        }

        { ( flow === PASSWORD || flow === ACCESS_CODE || flow === APPLICATION ) && <div className="auth__row">
            <p>Token URL:<code> { schema.get("tokenUrl") }</code></p>
          </div>
        }

        <div className="auth__row">
          <p className="flow">Flow: <code>{ schema.get("flow") }</code></p>
        </div>

        { flow !== PASSWORD
            ? null
            : <div>
                <div className="auth__row--form">
                  <label htmlFor="oauth_username"><span>Username:</span></label>
                  {
                    isAuthorized ? <code> { this.state.username } </code>
                      : <Input id="oauth_username" type="text" data-name="username" onChange={ this.onInputChange }/>
                  }
                </div>
                <div className="auth__row--form">
                  <label htmlFor="oauth_password"><span>Password:</span></label>
                  {
                    isAuthorized ? <code> ****** </code>
                      : <Input id="oauth_password" type="password" data-name="password" onChange={ this.onInputChange }/>
                  }
                </div>
                <div className="auth__row--form">
                  <label htmlFor="password_type"><span>Client credentials location:</span></label>
                  {
                    isAuthorized ? <code> { this.state.passwordType } </code>
                      : <DropDown id="password_type" onChange={ this.onInputChange } value="basic" dataName="passwordType">
                          <DropDownItem value="basic">Authorization header</DropDownItem>
                          <DropDownItem value="request-body">Request body</DropDownItem>
                        </DropDown>
                  }
                </div>
              </div>
        }
        { ( flow === APPLICATION || flow === IMPLICIT || flow === ACCESS_CODE || flow === PASSWORD ) &&
          ( !isAuthorized || isAuthorized && this.state.clientId) && <div className="auth__row--form">
            <label htmlFor="client_id"><span>client_id:</span></label>
            {
              isAuthorized ? <code> ****** </code>
                           : <Input id="client_id"
                                      type="text"
                                      required={ flow === PASSWORD }
                                      value={ this.state.clientId }
                                      data-name="clientId"
                                      onChange={ this.onInputChange }/>
            }
          </div>
        }

        { ( (flow === APPLICATION || flow === ACCESS_CODE || flow === PASSWORD) && <div className="auth__row--form">
            <label htmlFor="client_secret"><span>client_secret:</span></label>
            {
              isAuthorized ? <code> ****** </code>
                           : <Input id="client_secret"
                                      value={ this.state.clientSecret }
                                      type="text"
                                      data-name="clientSecret"
                                      onChange={ this.onInputChange }/>
            }

          </div>
        )}

        { !isAuthorized && scopes && scopes.size 
          ? <div className="auth__row--form auth__row--scopes">
              <label><span>Scopes:</span></label>
              <div>
                { scopes.map((description, name) => {
                  return (
                    <div key={ name }>
                      <div className="checkbox">
                        <Input data-value={ name }
                              id={`${name}-${flow}-checkbox-${this.state.name}`}
                              disabled={ isAuthorized }
                              type="checkbox"
                              onChange={ this.onScopeChange }/>
                            <label htmlFor={`${name}-${flow}-checkbox-${this.state.name}`}>
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
            </div> : null
        }
          
        { 
          errors.valueSeq().map( (error, key) => {
            return <AuthError error={ error }
                              key={ key }/>
          } )
        }

        <div className="auth-btn-wrapper sui-btn-wrapper">
        { isValid &&
          ( 
            isAuthorized 
              ? <Button className="modal-btn" mod="tertiary-lt" onClick={ this.logout }><span>Logout</span></Button>
              : <Button className="modal-btn" mod="primary" onClick={ this.authorize }><span>Authorize</span></Button>
          )
        }
          <Button className="modal-btn" mod="secondary" onClick={ this.close }><span>Close</span></Button>
        </div>

      </div>
    )
  }
}
