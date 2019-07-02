import React from "react"
import PropTypes from "prop-types"

export default class AuthHttp extends React.Component {
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
		
		const AuthHttpBasic = getComponent("authHttpBasic")
		const AuthHttpBearer = getComponent("authHttpBearer")

    const scheme = (schema.get("scheme") || "").toLowerCase()
    const value = this.getValue()
		const errors = errSelectors.allErrors().filter( err => err.get("authId") === name)
		

    if(scheme === "basic") {
      return (
        <AuthHttpBasic
          getComponent={getComponent}
          name={name}
          schema={schema}
          value={value}
          errors={errors} 
          onChange={this.onChange}/>
      )
    }

    if(scheme === "bearer") {
      return (
        <AuthHttpBearer
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