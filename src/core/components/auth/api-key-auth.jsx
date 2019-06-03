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
    let value = e.target.value
    let newState = Object.assign({}, this.state, { value: value })

    this.setState(newState)
    onChange(newState)
  }

  render() {
    let { schema, getComponent, errSelectors, name, translate } = this.props
    const Input = getComponent("Input")
    const Row = getComponent("Row")
    const Col = getComponent("Col")
    const AuthError = getComponent("authError")
    const Markdown = getComponent( "Markdown" )
    const JumpToPath = getComponent("JumpToPath", true)
    let value = this.getValue()
    let errors = errSelectors.allErrors().filter( err => err.get("authId") === name)

    return (
      <div>
        <h4>
          <code>{ name || schema.get("name") }</code>&nbsp;
          {"("}{translate("auth.apiKey.title")}{")"}
          <JumpToPath path={[ "securityDefinitions", name ]} />
        </h4>
        { value && <h6>{translate("auth.authorized")}</h6>}
        <Row>
          <Markdown source={ schema.get("description") } />
        </Row>
        <Row>
          <p>{translate("auth.apiKey.name")} <code>{ schema.get("name") }</code></p>
        </Row>
        <Row>
          <p>{translate("auth.apiKey.in")} <code>{ schema.get("in") }</code></p>
        </Row>
        <Row>
          <label>{translate("auth.apiKey.value")}</label>
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
}
