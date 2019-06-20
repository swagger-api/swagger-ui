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

  defaultClasses = ({ unstyled, mod }) => !unstyled ? `sui-btn sui-btn--${mod}` : ""

  render() {
    const { unstyled, mod, className, ...props } = this.props

    return (
      <button
        {...props}
        className={cx(className, this.defaultClasses({ unstyled, mod }))}
      />
    )
  }
}