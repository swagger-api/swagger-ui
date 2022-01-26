import React, { Component } from "react"

export const componentDidCatch = console.error

const isClassComponent = component => component.prototype && component.prototype.isReactComponent

export const withErrorBoundary = (getSystem) => (WrappedComponent) => {
  const { getComponent, fn } = getSystem()
  const ErrorBoundary = getComponent("ErrorBoundary")
  const targetName = fn.getDisplayName(WrappedComponent)

  class WithErrorBoundary extends Component {
    render() {
      return (
        <ErrorBoundary targetName={targetName} getComponent={getComponent} fn={fn}>
          <WrappedComponent {...this.props} {...this.context} />
        </ErrorBoundary>
      )
    }
  }
  WithErrorBoundary.displayName = `WithErrorBoundary(${targetName})`
  if (isClassComponent(WrappedComponent)) {
    /**
     * We need to handle case of class components defining a `mapStateToProps` public method.
     * Components with `mapStateToProps` public method cannot be wrapped.
     */
    WithErrorBoundary.prototype.mapStateToProps = WrappedComponent.prototype.mapStateToProps
  }

  return WithErrorBoundary
}

