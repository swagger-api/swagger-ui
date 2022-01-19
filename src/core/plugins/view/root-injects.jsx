import React, { Component } from "react"
import ReactDOM from "react-dom"
import { connect, Provider } from "react-redux"
import omit from "lodash/omit"

const isFunctionComponent = component => !(component.prototype && component.prototype.isReactComponent)

const withSystem = (getSystem) => (WrappedComponent) => {
  const { fn } = getSystem()

  class WithSystem extends Component {
    render() {
      return <WrappedComponent {...getSystem()} {...this.props} {...this.context} />
    }
  }
  WithSystem.displayName = `WithSystem(${fn.getDisplayName(WrappedComponent)})`
  return WithSystem
}

const withRoot = (getSystem, reduxStore) => (WrappedComponent) => {
  const { fn } = getSystem()

  class WithRoot extends Component {
    render() {
      return (
        <Provider store={reduxStore}>
          <WrappedComponent {...this.props} {...this.context} />
        </Provider>
      )
    }
  }
  WithRoot.displayName = `WithRoot(${fn.getDisplayName(WrappedComponent)})`
  return WithRoot
}

export const withErrorBoundary = (getSystem) => (WrappedComponent) => {
  const { getComponent, fn } = getSystem()
  const ErrorBoundary = getComponent("ErrorBoundary")
  const targetName = fn.getDisplayName(WrappedComponent)
  const BaseClass = isFunctionComponent(WrappedComponent) ? Component : WrappedComponent

  /**
   * We need to handle case of class components defining a `mapStateToProps` method.
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

const makeContainer = (getSystem, component, reduxStore) => {
  const mapStateToProps = (state, ownProps) => {
    const props = {...ownProps, ...getSystem()}
    const customMapStateToProps = component.prototype?.mapStateToProps || (state => ({state}))
    return customMapStateToProps(state, props)
  }

  const wrappedWithSystem = withSystem(getSystem)(component)
  const connected = connect(mapStateToProps)(wrappedWithSystem)

  if (reduxStore) {
    return withRoot(getSystem, reduxStore)(connected)
  }
  return connected
}

const handleProps = (getSystem, mapping, props, oldProps) => {
  for (const prop in mapping) {
    const fn = mapping[prop]

    if (typeof fn === "function") {
      fn(props[prop], oldProps[prop], getSystem())
    }
  }
}

export const makeMappedContainer = (getSystem, getStore, memGetComponent, getComponents, componentName, mapping) => {
  return class extends Component {
    constructor(props, context) {
      super(props, context)
      handleProps(getSystem, mapping, props, {})
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      handleProps(getSystem, mapping, nextProps, this.props)
    }

    render() {
      const cleanProps = omit(this.props, mapping ? Object.keys(mapping) : [])
      const Comp = memGetComponent(componentName, "root")
      return <Comp {...cleanProps}/>
    }
  }
}

export const render = (getSystem, getStore, getComponent, getComponents, domNode) => {
  const App = getComponent(getSystem, getStore, getComponents, "App", "root")
  ReactDOM.render(<App/>, domNode)
}

export const getComponent = (getSystem, getStore, getComponents, componentName, container, config = {}) => {

  if (typeof componentName !== "string")
    throw new TypeError("Need a string, to fetch a component. Was given a " + typeof componentName)

    // getComponent has a config object as a third, optional parameter
    // using the config object requires the presence of the second parameter, container
    // e.g. getComponent("JsonSchema_string_whatever", false, { failSilently: true })
  const component = getComponents(componentName)

  if (!component) {
    if (!config.failSilently) {
      getSystem().log.warn("Could not find component:", componentName)
    }
    return null
  }

  if(!container) {
    return component
  }

  if(container === "root") {
    return makeContainer(getSystem, component, getStore())
  }

  // container == truthy
  return makeContainer(getSystem, component)
}
