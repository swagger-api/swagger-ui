import React from "react"
import PropTypes from "prop-types"
import cx from "classnames"

export default class Link extends React.Component {

  render() {
    return <a {...this.props} rel="noopener noreferrer" className={cx(this.props.className, "link")}/>
  }
  
}

Link.propTypes = {
  className: PropTypes.string
}