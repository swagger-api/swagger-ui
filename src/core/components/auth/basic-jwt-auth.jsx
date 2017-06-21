import React, { PropTypes } from "react"

export default class BasicJwtAuth extends React.Component {
  static propTypes = {
    authorized: PropTypes.object,
    getComponent: PropTypes.func.isRequired,
    errSelectors: PropTypes.object.isRequired,
    schema: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func
  }

  constructor(props, context) {
    super(props, context)
    let { name, schema } = this.props
    let value = this.getValue()
    let username = value.username

    this.state = {
      name: name,
      schema: schema,
      value: !username ? {} : {
        username: username
      }
    }
  }

  getValue () {
    let { name, authorized } = this.props

    return authorized && authorized.getIn([name, "value"]) || {}
  }

  onChange =(e) => {
    let { onChange } = this.props
    let value = e.target.value
    let newState = Object.assign({}, this.state, { value: value })

    this.setState(newState)
    onChange(newState)
  }

  render() {
    let { schema, getComponent, errSelectors, name } = this.props
    const Input = getComponent("Input")
    const Row = getComponent("Row")
    const Col = getComponent("Col")
    const AuthError = getComponent("authError")
    const Markdown = getComponent( "Markdown" )
    const JumpToPath = getComponent("JumpToPath", true)
    let value = this.getValue()
    let username = this.getValue().username
    let errors = errSelectors.allErrors().filter( err => err.get("authId") === name)

    let authorizationUrl = schema.get("authorizationUrl")
    let service = schema.get("service")
    let scope = schema.get("scope")

    return (
      <div>
        <h4>Basic Authentication with JWT Authorization<JumpToPath path={[ "securityDefinitions", name ]} /></h4>
        { username && <h6>Authorized</h6>}
        <Row>
          <Markdown source={ schema.get("description") } />
          <table>
            <tr>
              <td>Authorization URL</td>
              <td>: <code>{ authorizationUrl }</code></td>
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
          <h4></h4>
        </Row>
        <Row>
          <label>Username:</label>
          {
            username ? <code> { username } </code>
                     : <Col><Input type="text" required="required" name="username" onChange={ this.onChange }/></Col>
          }
        </Row>
        <Row>
          <label>Password:</label>
            {
              username ? <code> ****** </code>
                       : <Col><Input required="required"
                                     autoComplete="new-password"
                                     name="password"
                                     type="password"
                                     onChange={ this.onChange }/></Col>
            }
        </Row>
        {
          errors.valueSeq().map( (error, key) => {
            return <AuthError error={ error }
                              key={ key }/>
          } )
        }
      </div>
    )
  }
}
