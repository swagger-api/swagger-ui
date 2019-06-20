import React from "react"
import PropTypes from "prop-types"
import { NoMargin } from "components/layout-utils"

export default class Collapse extends React.Component {

  static propTypes = {
    isOpened: PropTypes.bool,
    children: PropTypes.node.isRequired,
    animated: PropTypes.bool
  }

  static defaultProps = {
    isOpened: false,
    animated: false
  }

  renderNotAnimated() {
    if(!this.props.isOpened)
      return <noscript/>
    return (
      <NoMargin>
        {this.props.children}
      </NoMargin>
    )
  }

  render() {
    let { animated, isOpened, children } = this.props

    if(!animated)
      return this.renderNotAnimated()

    children = isOpened ? children : null
    return (
      <NoMargin>
        {children}
      </NoMargin>
    )
  }

}

