import PropTypes from "prop-types"
import React, { Component } from "react"

import { componentDidCatch } from "../fn"
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
    this.props.fn.componentDidCatch(error, errorInfo)
  }

  render() {
    const { getComponent, targetName, children } = this.props

    if (this.state.hasError) {
      const FallbackComponent = getComponent("Fallback")
      return <FallbackComponent name={targetName} />
    }

    return children
  }
}
ErrorBoundary.propTypes = {
  targetName: PropTypes.string,
  getComponent: PropTypes.func,
  fn: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ])
}
ErrorBoundary.defaultProps = {
  targetName: "this component",
  getComponent: () => Fallback,
  fn: {
    componentDidCatch,
  },
  children: null,
}

export default ErrorBoundary
