import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

const IMPLICIT = "implicit"
const PASSWORD = "password"
let ACCESS_CODE
let APPLICATION

export default class Oauth2 extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    getComponent: PropTypes.func.isRequired,
    schema: ImPropTypes.map.isRequired,
    authorizedData: ImPropTypes.map.isRequired,
    configs: PropTypes.object.isRequired,
    errors: ImPropTypes.list.isRequired,
    isOAS3: PropTypes.bool.isRequired,
    authorize: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired
  }

  constructor(props, context) {
    super(props, context)
    
    const { authorizedData, configs, isOAS3 } = this.props

    ACCESS_CODE = isOAS3 ? "authorizationCode" : "accessCode"
    APPLICATION = isOAS3 ? "clientCredentials" : "application"

    const username = authorizedData && authorizedData.get("username") || ""
    const clientId = authorizedData && authorizedData.get("clientId") || configs.clientId || ""
    const clientSecret = authorizedData && authorizedData.get("clientSecret") || configs.clientSecret || ""
    const passwordType = authorizedData && authorizedData.get("passwordType") || "basic"


    this.state = {
      appName: configs.appName,
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
    const { closeModal } = this.props

    closeModal()
  }

  authorizeClick = (e) => {
    e.preventDefault()
    const { authorize, name, schema } = this.props
    
    authorize(name, this.state, schema)
  }

  onScopeChange = (e) => {
    const { target } = e
    const { checked } = target
    const { scopes } = this.state
    const scope = target.dataset.value

    if ( checked && scopes.indexOf(scope) === -1 ) {
      const newScopes = scopes.concat([scope])
      
      this.setState({ scopes: newScopes })
    } 
    else if ( !checked && scopes.indexOf(scope) > -1) {
      this.setState({ scopes: scopes.filter((val) => val !== scope) })
    }
  }

  onInputChange = (e) => {
    const value = e.value || e.target.value
    const name = e["data-name"] || e.target.dataset.name

    this.setState({ [name]: value })
  }

  logout = (e) => {
    e.preventDefault()
    const { logout, clearErrors, name, configs } = this.props

    clearErrors(name)

    logout(name)

    this.setState({
      appName: configs.appName,
      scopes: [],
      clientId: configs.clientId || "",
      clientSecret: configs.clientSecret || "",
      username: "",
      password: "",
      passwordType: configs.clientId || ""
    })
  }

  render() {
    const { schema, getComponent, errors, name, authorizedData } = this.props
    const { appName, username, passwordType, clientId, clientSecret } = this.state

    const AuthBtnGroup = getComponent("AuthBtnGroup")
    const AuthError = getComponent("authError")
    const AuthOauth2Info = getComponent("AuthOauth2Info")
    const Oauth2Form = getComponent("Oauth2Form")
    const Oauth2FormData = getComponent("Oauth2FormData")

    const flow = schema.get("flow")
    const scopes = schema.get("allowedScopes") || schema.get("scopes")

    const isAuthorized = !!authorizedData
    const inValid = errors.filter( err => err.get("source") === "validation").size
    const showAuthURL = flow === IMPLICIT || flow === ACCESS_CODE
    const showTokenURL = flow === PASSWORD || flow === ACCESS_CODE || flow === APPLICATION
    const showBasicCreds = flow === PASSWORD
    const showClientID = (!isAuthorized || isAuthorized && clientId) 
      && (flow === APPLICATION || flow === IMPLICIT || flow === ACCESS_CODE || flow === PASSWORD)
    const showClientSecret = flow === APPLICATION || flow === ACCESS_CODE || flow === PASSWORD
    const showScopes = scopes && scopes.size 

    return (
      <div>
        <AuthOauth2Info
          getComponent={getComponent}
          name={name}
          schema={schema}
          appName={appName}
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
              username={username}
              passwordType={passwordType}
            />
          : <Oauth2Form
              getComponent={getComponent}
              showBasicCreds={showBasicCreds}
              showClientID={showClientID}
              showClientSecret={showClientSecret}
              showScopes={showScopes}
              clientId={clientId}
              clientIdRequired={flow === PASSWORD}
              clientSecret={clientSecret}
              scopes={scopes}
              scopeName={name}
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
          authorizeClick={this.authorizeClick}
          closeClick={this.close}
        />

      </div>
    )
  }
}
