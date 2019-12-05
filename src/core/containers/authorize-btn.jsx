import React from "react"
import PropTypes from "prop-types"
import { getAuthStore } from "../utils"

export default class AuthorizeBtnContainer extends React.Component {

  static propTypes = {
    specActions: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
    authSelectors: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { authSelectors } = this.props
    const definitions = authSelectors.definitionsToAuthorize()
    if(definitions && definitions.size){
      const state = {}
      const store = getAuthStore() || {}
      const { authActions } = this.props
      definitions.forEach(([array]) => {
        const [k] = array
        if(store[k]){
          state[k] = store[k]
        }
      })
      if(Object.keys(state)){
        authActions.authorize(state)
      }
    }
  }

  render () {
    const { authActions, authSelectors, specSelectors, getComponent} = this.props

    const securityDefinitions = specSelectors.securityDefinitions()
    const authorizableDefinitions = authSelectors.definitionsToAuthorize()

    const AuthorizeBtn = getComponent("authorizeBtn")

    return securityDefinitions ? (
      <AuthorizeBtn
        onClick={() => authActions.showDefinitions(authorizableDefinitions)}
        isAuthorized={!!authSelectors.authorized().size}
        showPopup={!!authSelectors.shownDefinitions()}
        getComponent={getComponent}
      />
    ) : null
  }
}
