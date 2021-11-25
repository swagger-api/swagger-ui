import PropTypes from "prop-types"
import React, { Component } from "react"

import Fallback from "./fallback"

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo) // eslint-disable-line no-console
  }

  render() {
    const { getComponent, targetName, children } = this.props
    const FallbackComponent = getComponent("Fallback")

    if (this.state.hasError) {
      return <FallbackComponent name={targetName} />
    }

    return children
  }
}
ErrorBoundary.propTypes = {
  targetName: PropTypes.string,
  getComponent: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ])
}
ErrorBoundary.defaultProps = {
  targetName: "this component",
  getComponent: () => Fallback,
  children: null,
}

export default ErrorBoundary
