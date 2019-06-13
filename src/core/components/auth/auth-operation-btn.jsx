import React from "react"
import PropTypes from "prop-types"
import cx from "classnames"

import { Button, Icon } from "components/layout-utils"

export default class AuthorizeOperationBtn extends React.Component {
  static propTypes = {
    isAuthorized: PropTypes.bool.isRequired,
    onClick: PropTypes.func
  }

  onClick =(e) => {
    e.stopPropagation()
    let { onClick } = this.props

    if(onClick) {
      onClick()
    }
  }

  render() {
    let { isAuthorized } = this.props

    return (
      <Button
        unstyled
        className={cx("sui-btn-transparent authorization__btn", {
          "locked": isAuthorized,
          "unlocked": !isAuthorized
        })}
        aria-label={cx("authorization button", {
          "locked": isAuthorized,
          "unlocked": !isAuthorized
        })}
        onClick={this.onClick}
      >
        <Icon
          icon={cx({
            "shield-alt-regular": !isAuthorized,
            "shield-check-regular": isAuthorized,
          })}
          className={cx({
            "sui-btn-transparent__icon--unlocked": !isAuthorized,
            "sui-btn-transparent__icon--locked": isAuthorized
          })}
        />
      </Button>
    )
  }
}
