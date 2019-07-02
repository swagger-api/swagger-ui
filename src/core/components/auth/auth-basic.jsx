import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

export default class BasicAuth extends React.Component {
  static propTypes = {
    authorized: PropTypes.object,
    getComponent: PropTypes.func.isRequired,
    schema: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  }

  constructor(props, context) {
    super(props, context)
    let { schema, name } = this.props

    const username = this.getAuthorizedUsername()

    this.state = {
      name: name,
      schema: schema,
      value: {
        username
      }
    }
  }

  getAuthorizedUsername () {
    let { authorized, name } = this.props

    return authorized && authorized.getIn([name, "value", "username"])
  }

  onChange =(e) => {
    let { onChange } = this.props
    let { value, name } = e.target

    let newValue = this.state.value
    newValue[name] = value

    this.setState({ value: newValue })

    onChange(this.state)
  }

  render() {
    let { schema, getComponent, name } = this.props
    const Input = getComponent("Input")
    const AuthFormRow = getComponent("AuthFormRow")
    const JumpToPath = getComponent("JumpToPath", true)
    const Markdown = getComponent( "Markdown" )
    let username = this.getAuthorizedUsername()

    return (
      <div>
        <div className="auth__header">
          <h4>
            Basic authorization<JumpToPath path={[ "securityDefinitions", name ]} />
          </h4>
        </div>

        { username && <div className="auth__row">
            <h6>Authorized</h6>
          </div>
        }

        <div className="auth__row">
          <Markdown source={ schema.get("description") } />
        </div>

        {
          username
          ? <div>
              <div className="auth__row">
                <p>Username: <code>{ username }</code></p>
              </div>
              <div className="auth__row">
                <p>Password: <code>******</code></p>
              </div>
            </div>
          : <div>
              <AuthFormRow label="Username:" htmlFor="basic-auth-username">
                <Input id="basic-auth-username" type="text" required="required" name="username" onChange={ this.onChange }/>
              </AuthFormRow>
              <AuthFormRow label="Password:" htmlFor="basic-auth-password">
                <Input id="basic-auth-password" type="password" required="required" name="password" autoComplete="new-password" onChange={ this.onChange }/>
              </AuthFormRow>
            </div>
        }
      </div>
    )
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
    getComponent: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    schema: ImPropTypes.map,
    authorized: ImPropTypes.map
  } // TODO: get rid of two proptypes
}
