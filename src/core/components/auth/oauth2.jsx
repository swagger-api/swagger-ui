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
    oas3Selectors: PropTypes.object.isRequired,
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
    let scopes = auth && auth.get("scopes") || authConfigs.scopes || []
    if (typeof scopes === "string") {
      scopes = scopes.split(authConfigs.scopeSeparator || " ")
    }

    this.state = {
      appName: authConfigs.appName,
      name: name,
      schema: schema,
      scopes: scopes,
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
    let { authActions, errActions, getConfigs, authSelectors, oas3Selectors } = this.props
    let configs = getConfigs()
    let authConfigs = authSelectors.getConfigs()

    errActions.clear({authId: name,type: "auth", source: "auth"})
    oauth2Authorize({
      auth: this.state,
      currentServer: oas3Selectors.serverEffectiveValue(oas3Selectors.selectedServer()),
      authActions,
      errActions,
      configs,
      authConfigs
    })
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
    let { target : { dataset : { name }, value } } = e
    let state = {
      [name]: value
    }

    this.setState(state)
  }

  selectScopes =(e) => {
    if (e.target.dataset.all) {
      this.setState({
        scopes: Array.from((this.props.schema.get("allowedScopes") || this.props.schema.get("scopes")).keys())
      })
    } else {
      this.setState({ scopes: [] })
    }
  }

  logout =(e) => {
    e.preventDefault()
    let { authActions, errActions, name } = this.props

    errActions.clear({authId: name, type: "auth", source: "auth"})
    authActions.logoutWithPersistOption([ name ])
  }

  render() {
    let {
      schema, getComponent, authSelectors, errSelectors, name, specSelectors
    } = this.props
    const Input = getComponent("Input")
    const Row = getComponent("Row")
    const Col = getComponent("Col")
    const Button = getComponent("Button")
    const AuthError = getComponent("authError")
    const JumpToPath = getComponent("JumpToPath", true)
    const Markdown = getComponent("Markdown", true)
    const InitializedInput = getComponent("InitializedInput")

    const { isOAS3 } = specSelectors

    let oidcUrl = isOAS3() ? schema.get("openIdConnectUrl") : null

    // Auth type consts
    const AUTH_FLOW_IMPLICIT = "implicit"
    const AUTH_FLOW_PASSWORD = "password"
    const AUTH_FLOW_ACCESS_CODE = isOAS3() ? (oidcUrl ? "authorization_code" : "authorizationCode") : "accessCode"
    const AUTH_FLOW_APPLICATION = isOAS3() ? (oidcUrl ? "client_credentials" : "clientCredentials") : "application"

    let authConfigs = authSelectors.getConfigs() || {}
    let isPkceCodeGrant = !!authConfigs.usePkceWithAuthorizationCodeGrant

    let flow = schema.get("flow")
    let flowToDisplay = flow === AUTH_FLOW_ACCESS_CODE && isPkceCodeGrant ? flow + " with PKCE" : flow
    let scopes = schema.get("allowedScopes") || schema.get("scopes")
    let authorizedAuth = authSelectors.authorized().get(name)
    let isAuthorized = !!authorizedAuth
    let errors = errSelectors.allErrors().filter( err => err.get("authId") === name)
    let isValid = !errors.filter( err => err.get("source") === "validation").size
    let description = schema.get("description")

    return (
      <div>
        <h4>{name} (OAuth2, { flowToDisplay }) <JumpToPath path={[ "securityDefinitions", name ]} /></h4>
        { !this.state.appName ? null : <h5>Application: { this.state.appName } </h5> }
        { description && <Markdown source={ schema.get("description") } /> }

        { isAuthorized && <h6>Authorized</h6> }

        { oidcUrl && <p>OpenID Connect URL: <code>{ oidcUrl }</code></p> }
        { ( flow === AUTH_FLOW_IMPLICIT || flow === AUTH_FLOW_ACCESS_CODE ) && <p>Authorization URL: <code>{ schema.get("authorizationUrl") }</code></p> }
        { ( flow === AUTH_FLOW_PASSWORD || flow === AUTH_FLOW_ACCESS_CODE || flow === AUTH_FLOW_APPLICATION ) && <p>Token URL:<code> { schema.get("tokenUrl") }</code></p> }
        <p className="flow">Flow: <code>{ flowToDisplay }</code></p>

        {
          flow !== AUTH_FLOW_PASSWORD ? null
            : <Row>
              <Row>
                <label htmlFor="oauth_username">username:</label>
                {
                  isAuthorized ? <code> { this.state.username } </code>
                    : <Col tablet={10} desktop={10}>
                      <input id="oauth_username" type="text" data-name="username" onChange={ this.onInputChange } autoFocus/>
                    </Col>
                }
              </Row>
              {

              }
              <Row>
                <label htmlFor="oauth_password">password:</label>
                {
                  isAuthorized ? <code> ****** </code>
                    : <Col tablet={10} desktop={10}>
                      <input id="oauth_password" type="password" data-name="password" onChange={ this.onInputChange }/>
                    </Col>
                }
              </Row>
              <Row>
                <label htmlFor="password_type">Client credentials location:</label>
                {
                  isAuthorized ? <code> { this.state.passwordType } </code>
                    : <Col tablet={10} desktop={10}>
                      <select id="password_type" data-name="passwordType" onChange={ this.onInputChange }>
                        <option value="basic">Authorization header</option>
                        <option value="request-body">Request body</option>
                      </select>
                    </Col>
                }
              </Row>
            </Row>
        }
        {
          ( flow === AUTH_FLOW_APPLICATION || flow === AUTH_FLOW_IMPLICIT || flow === AUTH_FLOW_ACCESS_CODE || flow === AUTH_FLOW_PASSWORD ) &&
          ( !isAuthorized || isAuthorized && this.state.clientId) && <Row>
            <label htmlFor="client_id">client_id:</label>
            {
              isAuthorized ? <code> ****** </code>
                           : <Col tablet={10} desktop={10}>
                               <InitializedInput id="client_id"
                                      type="text"
                                      required={ flow === AUTH_FLOW_PASSWORD }
                                      initialValue={ this.state.clientId }
                                      data-name="clientId"
                                      onChange={ this.onInputChange }/>
                             </Col>
            }
          </Row>
        }

        {
          ( (flow === AUTH_FLOW_APPLICATION || flow === AUTH_FLOW_ACCESS_CODE || flow === AUTH_FLOW_PASSWORD) && <Row>
            <label htmlFor="client_secret">client_secret:</label>
            {
              isAuthorized ? <code> ****** </code>
                           : <Col tablet={10} desktop={10}>
                               <InitializedInput id="client_secret"
                                      initialValue={ this.state.clientSecret }
                                      type="password"
                                      data-name="clientSecret"
                                      onChange={ this.onInputChange }/>
                             </Col>
            }

          </Row>
        )}

        {
          !isAuthorized && scopes && scopes.size ? <div className="scopes">
            <h2>
              Scopes:
              <a onClick={this.selectScopes} data-all={true}>select all</a>
              <a onClick={this.selectScopes}>select none</a>
            </h2>
            { scopes.map((description, name) => {
              return (
                <Row key={ name }>
                  <div className="checkbox">
                    <Input data-value={ name }
                          id={`${name}-${flow}-checkbox-${this.state.name}`}
                           disabled={ isAuthorized }
                           checked={ this.state.scopes.includes(name) }
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
                </Row>
              )
              }).toArray()
            }
          </div> : null
        }

        {
          errors.valueSeq().map( (error, key) => {
            return <AuthError error={ error }
                              key={ key }/>
          } )
        }
        <div className="auth-btn-wrapper">
        { isValid &&
          ( isAuthorized ? <Button className="btn modal-btn auth authorize" onClick={ this.logout }>Logout</Button>
        : <Button className="btn modal-btn auth authorize" onClick={ this.authorize }>Authorize</Button>
          )
        }
          <Button className="btn modal-btn auth btn-done" onClick={ this.close }>Close</Button>
        </div>

      </div>
    )
  }
}
