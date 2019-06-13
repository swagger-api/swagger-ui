import React from "react"
import PropTypes from "prop-types"

export default class ApiKeyAuth extends React.Component {
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
    let value = e.target.value
    let newState = Object.assign({}, this.state, { value: value })

    this.setState(newState)
    onChange(newState)
  }

  render() {
    let { schema, getComponent, errSelectors, name } = this.props
    const Input = getComponent("Input")
    const AuthError = getComponent("authError")
    const AuthHeader = getComponent("AuthHeader")
    const AuthRow = getComponent("AuthRow")
    const AuthFormRow = getComponent("AuthFormRow")
    const Markdown = getComponent( "Markdown" )
    const JumpToPath = getComponent("JumpToPath", true)
    let value = this.getValue()
    let errors = errSelectors.allErrors().filter( err => err.get("authId") === name)

    return (
      <div>
        <AuthHeader>
          <code>{ name || schema.get("name") }</code>&nbsp;
          (apiKey)
          <JumpToPath path={[ "securityDefinitions", name ]} />
        </AuthHeader>

        { value && <AuthRow>
            <h6>Authorized</h6>
          </AuthRow>
        }

        <AuthRow>
          <Markdown source={ schema.get("description") } />
        </AuthRow>

        <AuthRow>
          <p>Name: <code>{ schema.get("name") }</code></p>
        </AuthRow>

        <AuthRow>
          <p>In: <code>{ schema.get("in") }</code></p>
        </AuthRow>

        
        { value
          ? <AuthRow>
              <p>Value: <code>******</code></p>
            </AuthRow>
          : <AuthFormRow label="Value:" htmlFor="api-key-value">
              <Input id="api-key-value" type="text" onChange={ this.onChange }/>
            </AuthFormRow>
        }

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
