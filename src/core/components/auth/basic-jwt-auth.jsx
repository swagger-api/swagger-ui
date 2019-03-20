import React, { PropTypes } from "react"

export default class BasicJwtAuth extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    authorized: PropTypes.object,
    getComponent: PropTypes.func.isRequired,
    schema: PropTypes.object.isRequired,
    authSelectors: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
    errSelectors: PropTypes.object.isRequired,
    errActions: PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props, context)
    let { name, schema, authorized } = this.props
    let auth = authorized && authorized.get(name)
    let username = auth && auth.get("username") || ""

    this.state = {
      name: name,
      schema: schema,
      username: username,
      password: ""
    }
  }

  authorize =() => {
    let { authActions, errActions, name } = this.props

    errActions.clear({ authId: name,type: "auth", source: "auth" })
    authActions.authorizeBasicToken(this.state)
  }

  onChange =(e) => {
    let { target : { dataset : { name }, value } } = e
    let state = {
      [name]: value
    }

    this.setState(state)
  }

  logout =(e) => {
    e.preventDefault()
    let { authActions, errActions, name } = this.props

    errActions.clear({ authId: name, type: "auth", source: "auth" })
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

    let authorizedAuth = authSelectors.authorized().get(name)
    let isAuthorized = !!authorizedAuth
    let errors = errSelectors.allErrors().filter( err => err.get("authId") === name)

    let description = schema.get("description")
    let tokenUrl = schema.get("tokenUrl")
    let service = schema.get("service")
    let scope = schema.get("scope")

    return (
      <div>
        <h4>Basic Authentication with JWT Authorization<JumpToPath path={[ "securityDefinitions", name ]} /></h4>
        { description && <Markdown source={ description } /> }
        { isAuthorized && <h6>Authorized</h6> }
        <Row>
          <p>
            <table>
              <tr>
                <td>Token URL</td>
                <td>: <code>{ tokenUrl }</code></td>
              </tr>
              <tr>
                <td>Service</td>
                <td>: <code>{ service }</code></td>
              </tr>
              <tr>
                <td>Scope</td>
                <td>: <code>{ scope }</code></td>
              </tr>
            </table>
          </p>
          <h4></h4>
        </Row>
        <Row>
          <label htmlFor="jwt_username">Username:</label>
          {
            isAuthorized ? <code> { this.state.username } </code>
                         : <Col><Input id="jwt_username"
                                       type="text"
                                       required="required"
                                       data-name="username"
                                       onChange={ this.onChange }/></Col>
          }
        </Row>
        <Row>
          <label htmlFor="jwt_password">Password:</label>
          {
            isAuthorized ? <code> ****** </code>
                         : <Col><Input id="jwt_password"
                                       type="password"
                                       required="required"
                                       autoComplete="new-password"
                                       data-name="password"
                                       onChange={ this.onChange }/></Col>
          }
        </Row>
        {
          errors.valueSeq().map( (error, key) => {
            return <AuthError error={ error }
                              key={ key }/>
          } )
        }
        <div className="auth-btn-wrapper">
        { isAuthorized ? <Button className="btn modal-btn auth authorize" onClick={ this.logout }>Logout</Button>
                       : <Button className="btn modal-btn auth authorize" onClick={ this.authorize }>Authorize</Button>
        }
        </div>

      </div>
    )
  }
}
