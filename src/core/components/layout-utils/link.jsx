import React from "react"
import PropTypes from "prop-types"
import { xclass } from "core/utils"

export default class Link extends React.Component {

  render() {
    return <a {...this.props} rel="noopener noreferrer" className={xclass(this.props.className, "link")}/>
  }

}

Link.propTypes = {
  className: PropTypes.string
}