import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

export default class Auths extends React.Component {
  static propTypes = {
    errSelectors: PropTypes.object.isRequired,
    schema: ImPropTypes.map.isRequired,
    name: PropTypes.string.isRequired,
    getComponent: PropTypes.func.isRequired,
    authorize: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    authSelectors: PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props, context)

    this.state = {}
  }

  onAuthChange = (auth) => {
    let { name } = auth

    this.setState({ [name]: auth })
  }

  authorizeClick = (e) => {
    e.preventDefault()
    let { authorize, name } = this.props
    
    authorize(name, this.state[name])
  }

  logoutClick = (e) => {
    e.preventDefault()
    let { logout, name } = this.props

    logout(name)
  }

  closeClick = (e) => {
    e.preventDefault()
    let { closeModal } = this.props

    closeModal()
  }

  render() {
    let { schema, name, getComponent, authSelectors, errSelectors } = this.props
    const ApiKeyAuth = getComponent("apiKeyAuth")
    const BasicAuth = getComponent("basicAuth")
    const AuthHttp = getComponent("authHttp")
    const AuthBtnGroup = getComponent("AuthBtnGroup")

    const authorizedData = authSelectors.authorized()
    const isAuthorized = !!authorizedData.get(name)
    const type = schema.get("type")
    let auth

    if(type === "apiKey") {
      auth = <ApiKeyAuth
        schema={ schema }
        name={ name }
        errSelectors={ errSelectors }
        authorized={ authorizedData }
        getComponent={ getComponent }
        onChange={ this.onAuthChange }
      />
    }
    if(type === "basic") {
      auth = <BasicAuth
        schema={ schema }
        name={ name }
        errSelectors={ errSelectors }
        authorized={ authorizedData }
        getComponent={ getComponent }
        onChange={ this.onAuthChange }
      />
    }
    if(type === "http") {
      auth = <AuthHttp
        schema={ schema }
        name={ name }
        errSelectors={ errSelectors }
        authorized={ authorizedData }
        getComponent={ getComponent }
        onChange={ this.onAuthChange }
      />
    }

    return auth
      ? <div>
          { auth }
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


