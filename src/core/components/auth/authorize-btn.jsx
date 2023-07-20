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
    const LockedAuthIcon = getComponent("LockedAuthIcon")
    const UnlockedAuthIcon = getComponent("UnlockedAuthIcon")

    return (
      <div className="auth-wrapper">
        <button className={isAuthorized ? "btn authorize locked" : "btn authorize unlocked"} onClick={onClick}>
          <span>Authorize</span>
          {isAuthorized ? <LockedAuthIcon /> : <UnlockedAuthIcon />}
        </button>
      { showPopup && <AuthorizationPopup /> }
      </div>
    )
  }
}
