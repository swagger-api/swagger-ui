import React from "react"
import PropTypes from "prop-types"

export default class ApiKeyAuth extends React.Component {
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
    let value = e.target.value
    let newState = Object.assign({}, this.state, { value: value })

    this.setState(newState)
    onChange(newState)
  }

  render() {
    let { schema, getComponent, errSelectors, name, authSelectors } = this.props
    const Input = getComponent("Input")
    const Row = getComponent("Row")
    const Col = getComponent("Col")
    const AuthError = getComponent("authError")
    const Markdown = getComponent("Markdown", true)
    const JumpToPath = getComponent("JumpToPath", true)
    const path = authSelectors.selectAuthPath(name)
    let value = this.getValue()
    let errors = errSelectors.allErrors().filter( err => err.get("authId") === name)

    return (
      <div>
        <h4>
          <code>{ name || schema.get("name") }</code>&nbsp;(apiKey)
          <JumpToPath path={path} />
        </h4>
        { value && <h6>Authorized</h6>}
        <Row>
          <Markdown source={ schema.get("description") } />
        </Row>
        <Row>
          <p>Name: <code>{ schema.get("name") }</code></p>
        </Row>
        <Row>
          <p>In: <code>{ schema.get("in") }</code></p>
        </Row>
        <Row>
          <label htmlFor="api_key_value">Value:</label>
          {
            value ? <code> ****** </code>
                  : <Col>
                      <Input 
                        id="api_key_value" 
                        type="text" 
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
}
