import React from "react"
import PropTypes from "prop-types"

export default class AuthorizeBtn extends React.Component {
  static propTypes = {
    onClick: PropTypes.func,
    isAuthorized: PropTypes.bool,
    showPopup: PropTypes.bool,
    getComponent: PropTypes.func.isRequired
  }

  render() {
    let { isAuthorized, showPopup, onClick, getComponent } = this.props

    //must be moved out of button component
    const AuthorizationPopup = getComponent("authorizationPopup", true)

    return (
      <div className="auth-wrapper">
        <button className={`sui-btn sui-btn--secondary authorize ${isAuthorized ? "locked" : "unlocked"}`} onClick={onClick}>
          <span>Authorize</span>
          <svg className="sui-btn__icon" width="15" height="15">
            <use href={ isAuthorized ? "#locked" : "#unlocked" } xlinkHref={ isAuthorized ? "#locked" : "#unlocked" } />
          </svg>
        </button>
      { showPopup && <AuthorizationPopup /> }
      </div>
    )
  }
}
