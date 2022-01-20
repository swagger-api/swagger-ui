import React, { Component } from "react"

export const componentDidCatch = console.error

const isFunctionComponent = component => !(component.prototype && component.prototype.isReactComponent)

export const withErrorBoundary = (getSystem) => (WrappedComponent) => {
  const { getComponent, fn } = getSystem()
  const ErrorBoundary = getComponent("ErrorBoundary")
  const targetName = fn.getDisplayName(WrappedComponent)
  const BaseClass = isFunctionComponent(WrappedComponent) ? Component : WrappedComponent

  /**
   * We need to handle case of class components defining a `mapStateToProps` public method.
   */
  class WithErrorBoundary extends BaseClass {
    render() {
      const children = BaseClass === Component
        ? <WrappedComponent {...this.props} {...this.context} />
        : super.render()

      return (
        <ErrorBoundary targetName={targetName} getComponent={getComponent} fn={fn}>
          {children}
        </ErrorBoundary>
      )
    }
  }
  WithErrorBoundary.displayName = `WithErrorBoundary(${fn.getDisplayName(WrappedComponent)})`
  return WithErrorBoundary
}

