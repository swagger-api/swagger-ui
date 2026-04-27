import React from "react"
import PropTypes from "prop-types"
import { fallbackT } from "core/plugins/i18n/fn"

export default class AuthorizeBtn extends React.Component {
  static propTypes = {
    onClick: PropTypes.func,
    isAuthorized: PropTypes.bool,
    showPopup: PropTypes.bool,
    getComponent: PropTypes.func.isRequired,
    t: PropTypes.func,
  }

  static defaultProps = {
    t: fallbackT,
  }

  render() {
    let { isAuthorized, showPopup, onClick, getComponent, t } = this.props

    //must be moved out of button component
    const AuthorizationPopup = getComponent("authorizationPopup", true)
    const LockAuthIcon = getComponent("LockAuthIcon", true)
    const UnlockAuthIcon = getComponent("UnlockAuthIcon", true)

    return (
      <div className="auth-wrapper">
        <button className={isAuthorized ? "btn authorize locked" : "btn authorize unlocked"} onClick={onClick}>
          <span>{t("button.authorize")}</span>
          {isAuthorized ? <LockAuthIcon /> : <UnlockAuthIcon />}
        </button>
      { showPopup && <AuthorizationPopup /> }
      </div>
    )
  }
}
