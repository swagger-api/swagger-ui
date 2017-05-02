import React, { PropTypes } from "react"

export default class AuthorizeBtn extends React.Component {
  static propTypes = {
    className: PropTypes.string
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
    let showPopup = !!authSelectors.shownDefinitions()
    let isAuthorized = !!authSelectors.authorized().size

    return (
      <div className="auth-wrapper">
        <button className={isAuthorized ? "btn authorize locked" : "btn authorize unlocked"} onClick={ this.onClick }>
          <span>Authorize</span>
          <svg width="20" height="20">
            <use xlinkHref={ isAuthorized ? "#locked" : "#unlocked" } />
          </svg>
        </button>
      { showPopup && <AuthorizationPopup /> }
      </div>
    )
  }


  static propTypes = {
    getComponent: PropTypes.func.isRequired,
    authSelectors: PropTypes.object.isRequired,
    errActions: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
  }
}
