import React from "react"
import PropTypes from "prop-types"

import { Button } from "components/layout-utils"

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
        className={`sui-btn-transparent authorization__btn ${isAuthorized ? "locked" : "unlocked"} `}
        aria-label={`authorization button ${isAuthorized ? "locked" : "unlocked"}`}
        onClick={this.onClick}
      >
        <svg width="20" height="20">
          <use
            href={ isAuthorized ? "#locked" : "#unlocked" }
            xlinkHref={ isAuthorized ? "#locked" : "#unlocked" }
          />
        </svg>
      </Button>
    )
  }
}
