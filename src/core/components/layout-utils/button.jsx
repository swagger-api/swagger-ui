import React from "react"
import PropTypes from "prop-types"
import cx from "classnames"

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
        className={cx(this.props.className, this.defaultClasses())}
      />
    )
  }
}