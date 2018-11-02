import React from "react"
import PropTypes from "prop-types"

export default class AuthorizeBtn extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    getState: PropTypes.object,
    scopes: PropTypes.string
  }

  onClick =() => {
    let { authActions, authSelectors } = this.props
    let definitions = authSelectors.definitionsToAuthorize()

    authActions.showDefinitions(definitions)
  }

  render() {
    let { authSelectors, getComponent } = this.props
    //must be moved out of button component
    const AuthorizationPopup = getComponent("authorizationPopup", true)
    let authToggled = this.props.getState().get("auth").get("toggleAuthButton") || false
    let showPopup = !!authSelectors.shownDefinitions()
    let isAuthorized = !!authSelectors.authorized().size
    let renderedHtml = <div />

    if (authToggled === true) {
      renderedHtml = (
        <div className="auth-wrapper">
          <button className={isAuthorized ? "btn authorize locked" : "btn authorize unlocked"} onClick={ this.onClick } title={ this.props.scopes }>
            <span>Authorize</span>
            <svg width="20" height="20">
              <use href={ isAuthorized ? "#locked" : "#unlocked" } xlinkHref={ isAuthorized ? "#locked" : "#unlocked" } />
            </svg>
          </button>
        { showPopup && <AuthorizationPopup /> }
        </div>
      )
    }

    return renderedHtml
}


  static propTypes = {
    getComponent: PropTypes.func.isRequired,
    authSelectors: PropTypes.object.isRequired,
    errActions: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
  }
}
