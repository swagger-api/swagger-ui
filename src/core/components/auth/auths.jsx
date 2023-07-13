import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

export default class Auths extends React.Component {
  static propTypes = {
    definitions: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    authSelectors: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
    errSelectors: PropTypes.object.isRequired,
    samlAuthActions: PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {}
  }

  onAuthChange =(auth) => {
    let { name } = auth

    this.setState({ [name]: auth })
  }

  submitAuth =(e) => {
    e.preventDefault()

    let { authActions } = this.props

    authActions.authorize(this.state)
  }

  logoutClick =(e) => {
    e.preventDefault()

    let { authActions, definitions } = this.props
    let auths = definitions.map( (val, key) => {
      return key
    }).toArray()

    authActions.logout(auths)
  }

  render() {
    const {
      definitions, getComponent, authSelectors, errSelectors, samlAuthActions
    } = this.props

    const ApiKeyAuth = getComponent("apiKeyAuth")
    const BasicAuth = getComponent("basicAuth")
    const BasicJwtAuth = getComponent("basicJwtAuth", true)
    const OtpJwtAuth = getComponent("otpJwtAuth", true)
    const SamlAuth = getComponent("samlAuth", true)
    const Oauth2 = getComponent("oauth2", true)

    let authorized = authSelectors.authorized()
    let isOtpAuthDefinition = (schema) => schema.get("type") === "apiKey" && schema.get("otp")
    let isSamlAuthDefinition = (schema) => schema.get("type") === "apiKey" && schema.get("saml")
    let nonOauthDefinitions = definitions.filter( schema => schema.get("type") !== "oauth2" && !isOtpAuthDefinition(schema) && !isSamlAuthDefinition(schema))
    let oauthDefinitions = definitions.filter( schema => schema.get("type") === "oauth2")
    let basicJwtDefinitions = definitions.filter( schema => schema.get("type") === "apiKey" && schema.get("tokenUrl") && !schema.get("otp") && !schema.get("saml"))
    let otpJwtDefinitions = definitions.filter(isOtpAuthDefinition)
    let samlDefinitions = definitions.filter(isSamlAuthDefinition)

    return (
      <div className="auth-container">
        {
          !!nonOauthDefinitions.size && <form onSubmit={ this.submitAuth }>
            {
              nonOauthDefinitions.map( (schema, name) => {
                let type = schema.get("type")
                let authEl

                switch(type) {
                  case "apiKey": authEl = <ApiKeyAuth key={ name }
                                                      schema={ schema }
                                                      name={ name }
                                                      errSelectors={ errSelectors }
                                                      authorized={ authorized }
                                                      getComponent={ getComponent }
                                                      onChange={ this.onAuthChange } />
                    break
                  case "basic": authEl = <BasicAuth key={ name }
                                                    schema={ schema }
                                                    name={ name }
                                                    errSelectors={ errSelectors }
                                                    authorized={ authorized }
                                                    getComponent={ getComponent }
                                                    onChange={ this.onAuthChange } />
                    break
                  default: authEl = <div key={ name }>Unknown security definition type { type }</div>
                }

                return (<div key={`${name}-jump`}>
                  { authEl }
                </div>)

              }).toArray()
            }
          </form>
        }

        {
          oauthDefinitions && oauthDefinitions.size ? <div>
          <div className="scope-def">
            <p>Scopes are used to grant an application different levels of access to data on behalf of the end user. Each API may declare one or more scopes.</p>
            <p>API requires the following scopes. Select which ones you want to grant to Swagger UI.</p>
          </div>
            {
              oauthDefinitions.map( (schema, name) =>{
                  return (<div key={ name }>
                    <Oauth2 authorized={ authorized }
                            schema={ schema }
                            name={ name } />
                  </div>)
                }
                ).toArray()
            }
          </div> : null
        }

        {
          basicJwtDefinitions && basicJwtDefinitions.size ? <div>
            {
              basicJwtDefinitions.map( (schema, name) =>{
                  return (<div key={ name }>
                    <BasicJwtAuth authorized={ authorized }
                                  schema={ schema }
                                  name={ name } />
                  </div>)
                }
                ).toArray()
            }
          </div> : null
        }

        {
          otpJwtDefinitions && otpJwtDefinitions.size ? <div>
            {
              otpJwtDefinitions.map( (schema, name) =>{
                  return (<div key={ name }>
                    <OtpJwtAuth authorized={ authorized }
                                schema={ schema }
                                name={ name } />
                  </div>)
                }
                ).toArray()
            }
          </div> : null
        }


        {
          samlDefinitions && samlDefinitions.size ? <div>
            {
              samlDefinitions.map( (schema, name) =>{
                  return (<div key={ name }>
                    <SamlAuth
                      schema={schema}
                      name={name}
                      authorized={authorized}
                      getComponent={getComponent}
                      samlAuthActions={samlAuthActions}
                    />
                  </div>)
                }
                ).toArray()
            }
          </div> : null
        }

      </div>
    )
  }
}
