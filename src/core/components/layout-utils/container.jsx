import React from "react"
import PropTypes from "prop-types"
import cx from "classnames"

export default class Container extends React.Component {
  render() {
    let { fullscreen, full, ...rest } = this.props
    // Normal element

    if(fullscreen)
      return <section {...rest}/>

    let containerClass = "swagger-container" + (full ? "-full" : "")
    return (
      <section {...rest} className={cx(rest.className, containerClass)}/>
    )
  }
}

Container.propTypes = {
  fullscreen: PropTypes.bool,
  full: PropTypes.bool,
  className: PropTypes.string
}