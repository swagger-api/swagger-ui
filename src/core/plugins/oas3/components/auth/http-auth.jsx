import React from "react"
import PropTypes from "prop-types"

export default class HttpAuth extends React.Component {
  static propTypes = {
    authorized: PropTypes.object,
    getComponent: PropTypes.func.isRequired,
    errSelectors: PropTypes.object.isRequired,
    schema: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    authSelectors: PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props, context)
    let { name, schema } = this.props
    let value = this.getValue()

    this.state = {
      name: name,
      schema: schema,
      value: value
    }
  }

  getValue () {
    let { name, authorized } = this.props

    return authorized && authorized.getIn([name, "value"])
  }

  onChange =(e) => {
    let { onChange } = this.props
    let { value, name } = e.target

    let newValue = Object.assign({}, this.state.value)

    if(name) {
      newValue[name] = value
    } else {
      newValue = value
    }

    this.setState({ value: newValue }, () => onChange(this.state))

  }

  render() {
    let { schema, getComponent, errSelectors, name, authSelectors } = this.props
    const Input = getComponent("Input")
    const Row = getComponent("Row")
    const Col = getComponent("Col")
    const AuthError = getComponent("authError")
    const Markdown = getComponent("Markdown", true)
    const JumpToPath = getComponent("JumpToPath", true)

    const scheme = (schema.get("scheme") || "").toLowerCase()
    const path = authSelectors.selectAuthPath(name)
    let value = this.getValue()
    let errors = errSelectors.allErrors().filter( err => err.get("authId") === name)

    if(scheme === "basic") {
      let username = value ? value.get("username") : null
      return <div>
        <h4>
          <code>{name}</code>&nbsp;
            (http, Basic)
            <JumpToPath path={path} />
          </h4>
        { username && <h6>Authorized</h6> }
        <Row>
          <Markdown source={ schema.get("description") } />
        </Row>
        <Row>
          <label htmlFor="auth-basic-username">Username:</label>
          {
            username ? <code> { username } </code>
              : <Col>
                  <Input 
                    id="auth-basic-username"
                    type="text"
                    required="required"
                    name="username"
                    aria-label="auth-basic-username"
                    onChange={ this.onChange }
                    autoFocus
                  />
                </Col>
          }
        </Row>
        <Row>
          <label htmlFor="auth-basic-password">Password:</label>
            {
              username ? <code> ****** </code>
                       : <Col>
                            <Input 
                              id="auth-basic-password"
                              autoComplete="new-password"
                              name="password"
                              type="password"
                              aria-label="auth-basic-password"
                              onChange={ this.onChange }
                            />
                          </Col>
          }
        </Row>
        {
          errors.valueSeq().map( (error, key) => {
            return <AuthError error={ error }
                              key={ key }/>
          } )
        }
      </div>
    }

    if(scheme === "bearer") {
      return (
        <div>
          <h4>
            <code>{name}</code>&nbsp;
              (http, Bearer)
              <JumpToPath path={path} />
            </h4>
            { value && <h6>Authorized</h6>}
            <Row>
              <Markdown source={ schema.get("description") } />
            </Row>
            <Row>
              <label htmlFor="auth-bearer-value">Value:</label>
              {
                value ? <code> ****** </code>
              : <Col>
                  <Input
                    id="auth-bearer-value"
                    type="text"
                    aria-label="auth-bearer-value"
                    onChange={ this.onChange }
                    autoFocus
                  />
                </Col>
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
  return <div>
    <em><b>{name}</b> HTTP authentication: unsupported scheme {`'${scheme}'`}</em>
  </div>
  }
}
