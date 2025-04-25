import React, { Component } from "react"
import ReactDOM from "react-dom"
import { compose } from "redux"
import { connect, Provider } from "react-redux"
import omit from "lodash/omit"
import identity from "lodash/identity"

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

const withConnect = (getSystem, WrappedComponent, reduxStore) => {
  const mapStateToProps = (state, ownProps) => {
    const props = {...ownProps, ...getSystem()}
    const customMapStateToProps = WrappedComponent.prototype?.mapStateToProps || (state => ({state}))
    return customMapStateToProps(state, props)
  }

  return compose(
    reduxStore ? withRoot(getSystem, reduxStore) : identity,
    connect(mapStateToProps),
    withSystem(getSystem),
  )(WrappedComponent)
}

const handleProps = (getSystem, mapping, props, oldProps) => {
  for (const prop in mapping) {
    const fn = mapping[prop]

    if (typeof fn === "function") {
      fn(props[prop], oldProps[prop], getSystem())
    }
  }
}

export const withMappedContainer = (getSystem, getStore, memGetComponent) => (componentName, mapping) => {
  const { fn } = getSystem()
  const WrappedComponent = memGetComponent(componentName, "root")

  class WithMappedContainer extends Component {
    constructor(props, context) {
      super(props, context)
      handleProps(getSystem, mapping, props, {})
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      handleProps(getSystem, mapping, nextProps, this.props)
    }

    render() {
      const cleanProps = omit(this.props, mapping ? Object.keys(mapping) : [])
      return <WrappedComponent {...cleanProps} />
    }
  }
  WithMappedContainer.displayName = `WithMappedContainer(${fn.getDisplayName(WrappedComponent)})`
  return WithMappedContainer
}

export const render = (getSystem, getStore, getComponent, getComponents) => (domNode) => {
  const App = getComponent(getSystem, getStore, getComponents)("App", "root")
  const { createRoot } = ReactDOM
  const root = createRoot(domNode)

  root.render(<App/>)
}

export const getComponent = (getSystem, getStore, getComponents) => (componentName, container, config = {}) => {

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
    return withConnect(getSystem, component, getStore())
  }

  // container == truthy
  return withConnect(getSystem, component)
}
