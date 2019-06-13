import React from "react"
import PropTypes from "prop-types"
import cx from "classnames"

import { Button, Icon } from "components/layout-utils"

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
          className={cx("sui-btn--authorize", { 
            "locked": isAuthorized,
            "unlocked": !isAuthorized
          })}
          mod="secondary"
          onClick={onClick}
        >
          <span>Authorize</span>
          <Icon
            icon={cx({
              "shield-alt-regular": !isAuthorized,
              "shield-check-regular": isAuthorized,
            })}
            className={cx({
              "sui-btn--authorize__icon--unlocked": !isAuthorized,
              "sui-btn--authorize__icon--locked": isAuthorized
            })}
          />
        </Button>
      { showPopup && <AuthorizationPopup /> }
      </div>
    )
  }
}
