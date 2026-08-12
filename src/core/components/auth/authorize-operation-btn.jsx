import React from "react"
import PropTypes from "prop-types"
import { fallbackT } from "core/plugins/i18n/fn"

export default class AuthorizeOperationBtn extends React.Component {
    static propTypes = {
      isAuthorized: PropTypes.bool.isRequired,
      onClick: PropTypes.func,
      getComponent: PropTypes.func.isRequired,
      t: PropTypes.func,
    }

    static defaultProps = {
      t: fallbackT,
    }

  onClick =(e) => {
    e.stopPropagation()
    let { onClick } = this.props

    if(onClick) {
      onClick()
    }
  }

  render() {
    let { isAuthorized, getComponent, t } = this.props

    const LockAuthOperationIcon = getComponent("LockAuthOperationIcon", true)
    const UnlockAuthOperationIcon = getComponent("UnlockAuthOperationIcon", true)

    return (
      <button className="authorization__btn"
        aria-label={isAuthorized ? t("aria.authorization_button_locked") : t("aria.authorization_button_unlocked")}
        onClick={this.onClick}>
        {isAuthorized ? <LockAuthOperationIcon className="locked" /> : <UnlockAuthOperationIcon className="unlocked"/>}
      </button>

    )
  }
}
