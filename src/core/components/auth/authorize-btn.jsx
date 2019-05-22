import React from "react"
import PropTypes from "prop-types"

import { Button } from "components/layout-utils"

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
        <Button
          className={`authorize ${isAuthorized ? "locked" : "unlocked"}`}
          mod="secondary"
          onClick={onClick}
        >
          <span>Authorize</span>
          <svg className="sui-btn__icon" width="15" height="15">
            <use
              href={ isAuthorized ? "#locked" : "#unlocked" }
              xlinkHref={ isAuthorized ? "#locked" : "#unlocked" }
            />
          </svg>
        </Button>
      { showPopup && <AuthorizationPopup /> }
      </div>
    )
  }
}
