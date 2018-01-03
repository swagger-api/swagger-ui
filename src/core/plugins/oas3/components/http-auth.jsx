import React from "react"
import PropTypes from "prop-types"

export default class HttpAuth extends React.Component {
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

    let newValue = this.state.value || {}

    if(name) {
      newValue[name] = value
    } else {
      newValue = value
    }

    this.setState({ value: newValue }, () => onChange(this.state))

  }

  render() {
    let { schema, getComponent, errSelectors, name } = this.props
    const Input = getComponent("Input")
    const Row = getComponent("Row")
    const Col = getComponent("Col")
    const AuthError = getComponent("authError")
    const Markdown = getComponent( "Markdown" )
    const JumpToPath = getComponent("JumpToPath", true)

    const scheme = schema.get("scheme")
    let value = this.getValue()
    let errors = errSelectors.allErrors().filter( err => err.get("authId") === name)

    if(scheme === "basic") {
      let username = value ? value.get("username") : null

      return <div>
        <h4>
          <code>{ name || schema.get("name") }</code>&nbsp;
            (http, Basic)
            <JumpToPath path={[ "securityDefinitions", name ]} />
          </h4>
        { username && <h6>Authorized</h6> }
        <Row>
          <Markdown source={ schema.get("description") } />
        </Row>
        <Row>
          <label>Username:</label>
          {
            username ? <code> { username } </code>
                     : <Col><Input name="username" onChange={ this.onChange } required="required" type="text"/></Col>
          }
        </Row>
        <Row>
          <label>Password:</label>
            {
              username ? <code> ****** </code>
                       : <Col><Input autoComplete="new-password"
                                     name="password"
                                     onChange={ this.onChange }
                                     required="required"
                                     type="password"/></Col>
            }
        </Row>
        {
          errors.valueSeq().map( (error, key) => {
            return <AuthError key={ key }
                              error={ error }/>
          } )
        }
      </div>
    }

    if(scheme === "bearer") {
      return (
        <div>
          <h4>
            <code>{ name || schema.get("name") }</code>&nbsp;
              (http, Bearer)
              <JumpToPath path={[ "securityDefinitions", name ]} />
            </h4>
            { value && <h6>Authorized</h6>}
            <Row>
              <Markdown source={ schema.get("description") } />
            </Row>
            <Row>
              <label>Value:</label>
              {
                value ? <code> ****** </code>
              : <Col><Input onChange={ this.onChange } type="text"/></Col>
          }
        </Row>
        {
          errors.valueSeq().map( (error, key) => {
            return <AuthError key={ key }
              error={ error }/>
          } )
        }
      </div>
    )
    }

  return <div>
    <em><b>{name}</b> HTTP authentication: unsupported or missing scheme</em>
  </div>
  }
}
