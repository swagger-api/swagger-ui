import React from "react"
import PropTypes from "prop-types"

export default class AuthorizeOperationBtn extends React.Component {
    static propTypes = {
      isAuthorized: PropTypes.bool.isRequired,
      onClick: PropTypes.func,
      getComponent: PropTypes.func.isRequired
    }

  onClick =(e) => {
    e.stopPropagation()
    let { onClick } = this.props

    if(onClick) {
      onClick()
    }
  }

  render() {
    let { isAuthorized, getComponent } = this.props

    const LockAuthOperationIcon = getComponent("LockAuthOperationIcon", true)
    const UnlockAuthOperationIcon = getComponent("UnlockAuthOperationIcon", true)

    return (
      <button className="authorization__btn"
        aria-label={isAuthorized ? "authorization button locked" : "authorization button unlocked"}
        onClick={this.onClick}>
        {isAuthorized ? <LockAuthOperationIcon className="locked" /> : <UnlockAuthOperationIcon className="unlocked"/>}
      </button>

    )
  }
}
