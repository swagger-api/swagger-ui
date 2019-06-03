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
    translate: PropTypes.func.isRequired
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
    let { schema, getComponent, errSelectors, name, translate } = this.props
    const Input = getComponent("Input")
    const Row = getComponent("Row")
    const Col = getComponent("Col")
    const AuthError = getComponent("authError")
    const Markdown = getComponent( "Markdown" )
    const JumpToPath = getComponent("JumpToPath", true)

    const scheme = (schema.get("scheme") || "").toLowerCase()
    let value = this.getValue()
    let errors = errSelectors.allErrors().filter( err => err.get("authId") === name)

    if(scheme === "basic") {
      let username = value ? value.get("username") : null
      return <div>
        <h4>
          <code>{ name || schema.get("name") }</code>&nbsp;
            {"("}{translate("auth.basic.scheme")}{")"}
            <JumpToPath path={[ "securityDefinitions", name ]} />
          </h4>
        { username && <h6>{translate("auth.authorized")}</h6> }
        <Row>
          <Markdown source={ schema.get("description") } />
        </Row>
        <Row>
          <label>{translate("auth.basic.username")}</label>
          {
            username ? <code> { username } </code>
                     : <Col><Input type="text" required="required" name="username" onChange={ this.onChange }/></Col>
          }
        </Row>
        <Row>
          <label>{translate("auth.basic.password")}</label>
            {
              username ? <code> {translate("auth.hidden")} </code>
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
    }

    if(scheme === "bearer") {
      return (
        <div>
          <h4>
            <code>{ name || schema.get("name") }</code>&nbsp;
              {"("}{translate("auth.bearer.scheme")}{")"}
              <JumpToPath path={[ "securityDefinitions", name ]} />
            </h4>
            { value && <h6>{translate("auth.authorized")}</h6>}
            <Row>
              <Markdown source={ schema.get("description") } />
            </Row>
            <Row>
              <label>{translate("auth.bearer.value")}</label>
              {
                value ? <code> {translate("auth.hidden")} </code>
              : <Col><Input type="text" onChange={ this.onChange }/></Col>
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
    <em>{translate("auth.unsupportedScheme.1", { scheme })}<b>{name}</b>{translate("auth.unsupportedScheme.2", { scheme })}</em>
  </div>
  }
}
