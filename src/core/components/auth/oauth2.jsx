import React, { PropTypes } from "react"
import oauth2Authorize from "core/oauth2-authorize"

const IMPLICIT = "implicit"
const ACCESS_CODE = "accessCode"
const PASSWORD = "password"
const APPLICATION = "application"

export default class Oauth2 extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    authorized: PropTypes.object,
    getComponent: PropTypes.func.isRequired,
    schema: PropTypes.object.isRequired,
    authSelectors: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
    errSelectors: PropTypes.object.isRequired,
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
    let { target : { dataset : { name }, value } } = e
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
    let { schema, getComponent, authSelectors, errSelectors, name } = this.props
    const Input = getComponent("Input")
    const Row = getComponent("Row")
    const Col = getComponent("Col")
    const Button = getComponent("Button")
    const AuthError = getComponent("authError")
    const JumpToPath = getComponent("JumpToPath", true)
    const Markdown = getComponent( "Markdown" )

    let flow = schema.get("flow")
    let scopes = schema.get("allowedScopes") || schema.get("scopes")
    let authorizedAuth = authSelectors.authorized().get(name)
    let isAuthorized = !!authorizedAuth
    let errors = errSelectors.allErrors().filter( err => err.get("authId") === name)
    let isValid = !errors.filter( err => err.get("source") === "validation").size

    return (
      <div>
        <h4>OAuth2.0 <JumpToPath path={[ "securityDefinitions", name ]} /></h4>
        { !this.state.appName ? null : <h5>Application: { this.state.appName } </h5> }
        <Markdown options={{html: true, typographer: true, linkify: true, linkTarget: "_blank"}}
                  source={ schema.get("description") } />

        { isAuthorized && <h6>Authorized</h6> }

        { ( flow === IMPLICIT || flow === ACCESS_CODE ) && <p>Authorization URL: <code>{ schema.get("authorizationUrl") }</code></p> }
        { ( flow === PASSWORD || flow === ACCESS_CODE || flow === APPLICATION ) && <p>Token URL:<code> { schema.get("tokenUrl") }</code></p> }
        <p className="flow">Flow: <code>{ schema.get("flow") }</code></p>

        {
          flow !== PASSWORD ? null
            : <Row>
              <Row>
                <label htmlFor="oauth_username">username:</label>
                {
                  isAuthorized ? <code> { this.state.username } </code>
                    : <Col tablet={10} desktop={10}>
                      <input id="oauth_username" type="text" data-name="username" onChange={ this.onInputChange }/>
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
                <label htmlFor="password_type">type:</label>
                {
                  isAuthorized ? <code> { this.state.passwordType } </code>
                    : <Col tablet={10} desktop={10}>
                      <select id="password_type" data-name="passwordType" onChange={ this.onInputChange }>
                        <option value="request-body">Request body</option>
                        <option value="basic">Basic auth</option>
                        <option value="query">Query parameters</option>
                      </select>
                    </Col>
                }
              </Row>
            </Row>
        }
        {
          ( flow === APPLICATION || flow === IMPLICIT || flow === ACCESS_CODE || ( flow === PASSWORD && this.state.passwordType!== "basic") ) &&
          ( !isAuthorized || isAuthorized && this.state.clientId) && <Row>
            <label htmlFor="client_id">client_id:</label>
            {
              isAuthorized ? <code> ****** </code>
                           : <Col tablet={10} desktop={10}>
                               <input id="client_id"
                                      type="text"
                                      required={ flow === PASSWORD }
                                      value={ this.state.clientId }
                                      data-name="clientId"
                                      onChange={ this.onInputChange }/>
                             </Col>
            }
          </Row>
        }

        {
          ( flow === APPLICATION || flow === ACCESS_CODE || ( flow === PASSWORD && this.state.passwordType!== "basic") ) && <Row>
            <label htmlFor="client_secret">client_secret:</label>
            {
              isAuthorized ? <code> ****** </code>
                           : <Col tablet={10} desktop={10}>
                               <input id="client_secret"
                                      value={ this.state.clientSecret }
                                      type="text"
                                      data-name="clientSecret"
                                      onChange={ this.onInputChange }/>
                             </Col>
            }

          </Row>
        }

        {
          !isAuthorized && scopes && scopes.size ? <div className="scopes">
            <h2>Scopes:</h2>
            { scopes.map((description, name) => {
              return (
                <Row key={ name }>
                  <div className="checkbox">
                    <Input data-value={ name }
                          id={`${name}-checkbox-${this.state.name}`}
                           disabled={ isAuthorized }
                           type="checkbox"
                           onChange={ this.onScopeChange }/>
                         <label htmlFor={`${name}-checkbox-${this.state.name}`}>
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
        </div>

      </div>
    )
  }
}
