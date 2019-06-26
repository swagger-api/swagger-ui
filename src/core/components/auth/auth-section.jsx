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
    const AuthBtnGroup = getComponent("AuthBtnGroup")

    let authorizedData = authSelectors.authorized()
    let isAuthorized = !!authorizedData.get(name)

    let auth

    const type = schema.get("type")

    switch(type) {
      case "apiKey": 
        auth = <ApiKeyAuth
          schema={ schema }
          name={ name }
          errSelectors={ errSelectors }
          authorized={ authorizedData }
          getComponent={ getComponent }
          onChange={ this.onAuthChange }
        />
        break
      case "basic": 
        auth = <BasicAuth
          schema={ schema }
          name={ name }
          errSelectors={ errSelectors }
          authorized={ authorizedData }
          getComponent={ getComponent }
          onChange={ this.onAuthChange }
        />
        break
      default: 
        auth = <div className="auth_row">
          <p>Unknown security definition type { type }</p>
        </div>
    }

    return (
      <div>
        { auth }
        
        <AuthBtnGroup
          getComponent={getComponent}
          isAuthorized={isAuthorized}
          logoutClick={this.logoutClick}
          authorizeClick={this.authorizeClick}
          closeClick={this.closeClick}
        />
      </div>
    )
  }
}


