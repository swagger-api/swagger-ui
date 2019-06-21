import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

export default class Auths extends React.Component {
  static propTypes = {
    errSelectors: PropTypes.object.isRequired,
    definition: ImPropTypes.map.isRequired,
    name: PropTypes.string.isRequired,
    getComponent: PropTypes.func.isRequired,
    authSelectors: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired
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

    let { authActions, name } = this.props

    authActions.logout([name])
  }

  close =(e) => {
    e.preventDefault()
    let { authActions } = this.props

    authActions.showDefinitions(false)
  }

  render() {
    let { definition, name, getComponent, authSelectors, errSelectors } = this.props
    const AuthItem = getComponent("AuthItem")
    const Oauth2 = getComponent("oauth2", true)
    const AuthBtnGroup = getComponent("AuthBtnGroup")

    let authorizedAuth = authSelectors.authorized()
    let isAuthorized = !!authorizedAuth.get(name)

    let isOauthDefinition = definition.get("type") === "oauth2"

    return (
      <div className="auth-container">
        {
          !isOauthDefinition && <div>
            <AuthItem
                schema={definition}
                name={name}
                getComponent={getComponent}
                onAuthChange={this.onAuthChange}
                authorized={authorizedAuth}
                errSelectors={errSelectors}
                />
            
            <AuthBtnGroup
              getComponent={getComponent}
              authorized={isAuthorized}
              logoutClick={this.logoutClick}
              authorizeClick={this.submitAuth}
              closeClick={this.close}
            />
          </div>
        }

        {
          isOauthDefinition ? <div>
            <Oauth2 authorized={ authorizedAuth }
                    schema={ definition }
                    name={ name } />
          </div> : null
        }

      </div>
    )
  }
}


