import React from "react"
import PropTypes from "prop-types"
import { xclass } from "core/utils"

export default class Button extends React.Component {

  static propTypes = {
    className: PropTypes.string,
    unstyled: PropTypes.bool,
    mod: PropTypes.string
  }

  static defaultProps = {
    className: "",
    unstyled: false,
    mod: "primary"
  }

  defaultClasses = () => !this.props.unstyled ? `sui-btn sui-btn--${this.props.mod}` : ""

  render() {
    return (
      <button
        {...this.props}
        className={xclass(this.props.className, this.defaultClasses())}    
      />
    )
  }
}