import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

export default class Auths extends React.Component {
  static propTypes = {
    schema: ImPropTypes.map.isRequired,
    name: PropTypes.string.isRequired,
    errors: ImPropTypes.list.isRequired,
    getComponent: PropTypes.func.isRequired,
    authorize: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    authorizedData: ImPropTypes.map.isRequired,
    isOAS3: PropTypes.bool.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    const value = props.authorizedData.get("value")

    this.state = {
      value: value
    }
  }

  onAuthChange = (e) => {
    const { value, name } = e.target
    let newValue = Object.assign({}, this.state.value)

    if(name) {
      newValue[name] = value
    } else {
      newValue = value
    }

    this.setState({ value: newValue })
  }

  authorizeClick = (e) => {
    e.preventDefault()
    const { authorize, name, schema } = this.props
    
    authorize(name, this.state.value, schema)
  }

  logoutClick = (e) => {
    e.preventDefault()
    const { logout, name } = this.props

    logout(name)
    this.setState({ value: null })
  }

  closeClick = (e) => {
    e.preventDefault()
    const { closeModal } = this.props

    closeModal()
  }

  render() {
    const { schema, name, getComponent, authorizedData, errors, isOAS3 } = this.props
    const ApiKeyAuth = getComponent("apiKeyAuth")
    const BasicAuth = getComponent("basicAuth")
    const AuthHttp = getComponent("authHttp")
    const AuthBtnGroup = getComponent("AuthBtnGroup")
    const AuthError = getComponent("authError")

    const isAuthorized = !!authorizedData.get(name)
    const authorizedUsername = authorizedData.getIn([name, "value", "username"])
    const type = schema.get("type")
    let auth

    if(type === "apiKey") {
      auth = <ApiKeyAuth
        schema={ schema }
        name={ name }
        isAuthorized={ isAuthorized }
        getComponent={ getComponent }
        onChange={ this.onAuthChange }
      />
    }
    if(type === "basic") {
      auth = <BasicAuth
        schema={ schema }
        name={ name }
        isAuthorized={ isAuthorized }
        authorizedUsername={ authorizedUsername }
        getComponent={ getComponent }
        onChange={ this.onAuthChange }
      />
    }
    if(type === "http" && isOAS3) {
      auth = <AuthHttp
        schema={ schema }
        name={ name }
        isAuthorized={ isAuthorized }
        authorizedUsername={ authorizedUsername }
        getComponent={ getComponent }
        onChange={ this.onAuthChange }
      />
    }

    return auth
      ? <div>
          { auth }

          {
            errors.valueSeq().map( (error, key) => {
              return <AuthError error={ error }
                                key={ key }/>
            })
          }

          <AuthBtnGroup
            getComponent={getComponent}
            isAuthorized={isAuthorized}
            logoutClick={this.logoutClick}
            authorizeClick={this.authorizeClick}
            closeClick={this.closeClick}
          />
        </div>
      : <div className="auth_row">
          <p>Unknown security definition type { type }</p>
        </div>
  }
}


