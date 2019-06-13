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

    let newValue = Object.assign({}, this.state.value)

    if(name) {
      newValue[name] = value
    } else {
      newValue = value
    }

    this.setState({ value: newValue }, () => onChange(this.state))

  }

  render() {
    const { schema, getComponent, errSelectors, name } = this.props

    const scheme = (schema.get("scheme") || "").toLowerCase()
    const value = this.getValue()
    const errors = errSelectors.allErrors().filter( err => err.get("authId") === name)
    const username = value ? value.get("username") : null

    if(scheme === "basic") {
      return (
        <HttpAuthBasic
          getComponent={getComponent}
          name={name}
          schema={schema}
          username={username}
          errors={errors} 
          onChange={this.onChange}/>
      )
    }

    if(scheme === "bearer") {
      return (
        <HttpAuthBearer
          getComponent={getComponent}
          name={name}
          schema={schema}
          value={value}
          errors={errors} 
          onChange={this.onChange}/>
      )
    }

  return (
    <div>
      <em><b>{name}</b> HTTP authentication: unsupported scheme {`'${scheme}'`}</em>
    </div>
   )
  }
}

const HttpAuthBasic = ({getComponent, name, schema, username, errors, onChange}) => {
  const AuthHeader = getComponent("AuthHeader")
  const AuthRow = getComponent("AuthRow")
  const AuthFormRow = getComponent("AuthFormRow")
  const AuthError = getComponent("authError")
  const Markdown = getComponent( "Markdown" )
  const JumpToPath = getComponent("JumpToPath", true)
  const Input = getComponent("Input")

  return (
    <div>
      <AuthHeader>
        <code>{ name || schema.get("name") }</code>&nbsp;
          (http, Basic)
          <JumpToPath path={[ "securityDefinitions", name ]} />
        </AuthHeader>

      { username && <AuthRow>
          <h6>Authorized</h6>
        </AuthRow> 
      }

      <AuthRow>
        <Markdown source={ schema.get("description") } />
      </AuthRow>

      {
        username
        ? <div>
            <AuthRow>
              <p>Username: <code>{ username }</code></p>
            </AuthRow>
            <AuthRow>
              <p>Password: <code>******</code></p>
            </AuthRow>
          </div>
        : <div>
            <AuthFormRow label="Username:" htmlFor="basic-html-auth-username">
              <Input id="basic-html-auth-username" type="text" required="required" name="username" onChange={ onChange }/>
            </AuthFormRow>
            <AuthFormRow label="Password:" htmlFor="basic-html-auth-password">
              <Input id="basic-html-auth-password" type="password" required="required" name="password" autoComplete="new-password" onChange={ onChange }/>
            </AuthFormRow>
          </div>
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

HttpAuthBasic.propTypes = {
  getComponent: PropTypes.func.isRequired,
  name: PropTypes.string,
  schema: PropTypes.object,
  username: PropTypes.string,
  errors: PropTypes.object,
  onChange: PropTypes.func
}

const HttpAuthBearer = ({getComponent, name, schema, value, errors, onChange}) => {
  const AuthHeader = getComponent("AuthHeader")
  const AuthRow = getComponent("AuthRow")
  const AuthFormRow = getComponent("AuthFormRow")
  const AuthError = getComponent("authError")
  const Markdown = getComponent( "Markdown" )
  const JumpToPath = getComponent("JumpToPath", true)
  const Input = getComponent("Input")

  return (
    <div>
      <AuthHeader>
        <code>{ name || schema.get("name") }</code>&nbsp;
          (http, Bearer)
          <JumpToPath path={[ "securityDefinitions", name ]} />
      </AuthHeader>

      { value && <AuthRow>
          <h6>Authorized</h6>
        </AuthRow>
      }

      <AuthRow>
        <Markdown source={ schema.get("description") } />
      </AuthRow>

      { value
        ? <AuthRow>
            <p>Value: <code>******</code></p>
          </AuthRow>
        : <AuthFormRow label="Username:" htmlFor="bearer-html-auth-value">
            <Input id="bearer-html-auth-value" type="text" onChange={ onChange }/>
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

HttpAuthBearer.propTypes = {
  getComponent: PropTypes.func.isRequired,
  name: PropTypes.string,
  schema: PropTypes.object,
  value: PropTypes.string,
  errors: PropTypes.object,
  onChange: PropTypes.func
}
