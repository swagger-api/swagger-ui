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
    const name = e["data-name"] || e.target.dataset.name

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
    const AuthBtnGroup = getComponent("AuthBtnGroup")
    const AuthError = getComponent("authError")
    const JumpToPath = getComponent("JumpToPath", true)
    const Markdown = getComponent( "Markdown" )
    const Oauth2Form = getComponent("Oauth2Form")
    const Oauth2FormData = getComponent("Oauth2FormData")

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
    let inValid = errors.filter( err => err.get("source") === "validation").size
    let description = schema.get("description")

    const showAuthURL = flow === IMPLICIT || flow === ACCESS_CODE
    const showTokenURL = flow === PASSWORD || flow === ACCESS_CODE || flow === APPLICATION
    const showBasicCreds = !(flow !== PASSWORD)
    const showClientID = (!isAuthorized || isAuthorized && this.state.clientId)
      && (flow === APPLICATION || flow === IMPLICIT || flow === ACCESS_CODE || flow === PASSWORD)
    const showClientSecret = (flow === APPLICATION || flow === ACCESS_CODE || flow === PASSWORD)
    const showScopes = scopes && scopes.size 

    return (
      <div>
        <div className="auth__description">
            <div>
              <p>Scopes are used to grant an application different levels of access to data on behalf of the end user. Each API may declare one or more scopes.</p>
            </div>
            <div>
              <p>API requires the following scopes. Select which ones you want to grant to Swagger UI.</p>
            </div>
          </div>
          
        <div className="auth__header">
          <h4>
            {name} (OAuth2, { schema.get("flow") }) <JumpToPath path={[ "securityDefinitions", name ]} />
          </h4>
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

        { showAuthURL && <div className="auth__row">
          <p>Authorization URL: <code>{ schema.get("authorizationUrl") }</code></p>
          </div>
        }

        { showTokenURL && <div className="auth__row">
            <p>Token URL: <code> { schema.get("tokenUrl") }</code></p>
          </div>
        }
        <div className="auth__row"> 
          <p className="flow">Flow: <code>{ flow }</code></p>
        </div>

        {
          isAuthorized
          ? <Oauth2FormData
              showBasicCreds={showBasicCreds}
              showClientID={showClientID}
              showClientSecret={showClientSecret}
              username={this.state.username}
              passwordType={this.state.passwordType}
            />
          : <Oauth2Form
              getComponent={getComponent}
              showBasicCreds={showBasicCreds}
              showClientID={showClientID}
              showClientSecret={showClientSecret}
              showScopes={showScopes}
              clientId={this.state.clientId}
              clientIdRequired={flow === PASSWORD}
              clientSecret={this.state.clientSecret}
              scopes={scopes}
              scopeName={this.state.name}
              flow={flow}
              onInputChange={this.onInputChange}
              onScopeChange={this.onScopeChange}
            />
        }
          
        { 
          errors.valueSeq().map( (error, key) => {
            return <AuthError error={ error }
                              key={ key }/>
          } )
        }

        <AuthBtnGroup
          getComponent={getComponent}
          authorized={isAuthorized}
          inValid={inValid}
          logoutClick={this.logout}
          authorizeClick={this.authorize}
          closeClick={this.close}
        />

      </div>
    )
  }
}
