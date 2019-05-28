import React from "react"
import PropTypes from "prop-types"
import { xclass } from "core/utils"

export default class Row extends React.Component {

  render() {
    return <div {...this.props} className={xclass(this.props.className, "wrapper")} />
  }

}

Row.propTypes = {
  className: PropTypes.string
}