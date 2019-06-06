import React from "react"
import PropTypes from "prop-types"
import cx from "classnames"

export default class Row extends React.Component {

  render() {
    return <div {...this.props} className={cx(this.props.className, "wrapper")} />
  }

}

Row.propTypes = {
  className: PropTypes.string
}