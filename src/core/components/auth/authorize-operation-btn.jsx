import React from "react"
import PropTypes from "prop-types"

export default class AuthorizeOperationBtn extends React.Component {
    static propTypes = {
      describedBy: PropTypes.string,
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
    let { describedBy, isAuthorized } = this.props

    return (
      <button className={isAuthorized ? "authorization__btn locked" : "authorization__btn unlocked"}
        aria-describedBy={describedBy ? describedBy : null}
        aria-haspopup="dialog"
        aria-label={isAuthorized ? "authorize locked" : "authorize unlocked"}
        onClick={this.onClick}>
        <svg width="20" height="20" aria-hidden="true">
          <use href={ isAuthorized ? "#locked" : "#unlocked" } xlinkHref={ isAuthorized ? "#locked" : "#unlocked" } />
        </svg>
      </button>
    )
  }
}
