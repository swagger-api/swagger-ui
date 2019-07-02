import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import oauth2Authorize from "core/oauth2-authorize"

export default class Oauth2 extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    authorizedData: PropTypes.object,
    getComponent: PropTypes.func.isRequired,
    schema: PropTypes.object.isRequired,
    authSelectors: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
    errors: ImPropTypes.list.isRequired,
    specSelectors: PropTypes.object.isRequired,
    errActions: PropTypes.object.isRequired,
    getConfigs: PropTypes.any
  }

  constructor(props, context) {
    super(props, context)
    let { name, schema, authorizedData, authSelectors } = this.props
    let auth = authorizedData && authorizedData.get(name)
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
    authActions.logout(name)
  }

  render() {
    const {
      schema,
      getComponent,
      errors,
      name,
      specSelectors,
      authorizedData
    } = this.props

    const AuthBtnGroup = getComponent("AuthBtnGroup")
    const AuthError = getComponent("authError")
    const AuthOauth2Info = getComponent("AuthOauth2Info")
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
    let authorizedAuth = authorizedData.get(name)
    let isAuthorized = !!authorizedAuth
    let inValid = errors.filter( err => err.get("source") === "validation").size

    const showAuthURL = flow === IMPLICIT || flow === ACCESS_CODE
    const showTokenURL = flow === PASSWORD || flow === ACCESS_CODE || flow === APPLICATION
    const showBasicCreds = (flow === PASSWORD)
    const showClientID = (!isAuthorized || isAuthorized && this.state.clientId)
      && (flow === APPLICATION || flow === IMPLICIT || flow === ACCESS_CODE || flow === PASSWORD)
    const showClientSecret = (flow === APPLICATION || flow === ACCESS_CODE || flow === PASSWORD)
    const showScopes = scopes && scopes.size 

    return (
      <div>
        <AuthOauth2Info
          getComponent={getComponent}
          name={name}
          schema={schema}
          appName={this.state.appName}
          isAuthorized={isAuthorized}
          showAuthURL={showAuthURL}
          showTokenURL={showTokenURL}
        />

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
          isAuthorized={isAuthorized}
          inValid={inValid}
          logoutClick={this.logout}
          authorizeClick={this.authorize}
          closeClick={this.close}
        />

      </div>
    )
  }
}
