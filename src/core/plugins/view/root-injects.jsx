import React, { Component } from "react"
import ReactDOM from "react-dom"
import { connect, Provider } from "react-redux"
import omit from "lodash/omit"

const SystemWrapper = (getSystem, ComponentToWrap ) => class extends Component {
  render() {
    return <ComponentToWrap {...getSystem()} {...this.props} {...this.context} />
  }
}

const RootWrapper = (getSystem, reduxStore, ComponentToWrap) => class extends Component {
  render() {
    const { getComponent } = getSystem()
    const ErrorBoundary = getComponent("ErrorBoundary", true)

    return (
      <Provider store={reduxStore}>
        <ErrorBoundary targetName={ComponentToWrap?.name}>
          <ComponentToWrap {...this.props} {...this.context} />
        </ErrorBoundary>
      </Provider>
    )
  }
}

const makeContainer = (getSystem, component, reduxStore) => {
  const mapStateToProps = function(state, ownProps) {
    const propsForContainerComponent = Object.assign({}, ownProps, getSystem())
    const ori = component.prototype.mapStateToProps || (state => { return {state} })
    return ori(state, propsForContainerComponent)
  }

  let wrappedWithSystem = SystemWrapper(getSystem, component, reduxStore)
  let connected = connect( mapStateToProps )(wrappedWithSystem)
  if(reduxStore)
    return RootWrapper(getSystem, reduxStore, connected)
  return connected
}

const handleProps = (getSystem, mapping, props, oldProps) => {
  for (let prop in mapping) {
    let fn = mapping[prop]
    if(typeof fn === "function")
      fn(props[prop], oldProps[prop], getSystem())
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
      let cleanProps = omit(this.props, mapping ? Object.keys(mapping) : [])
      let Comp = memGetComponent(componentName, "root")
      return <Comp {...cleanProps}/>
    }

  }

}

export const render = (getSystem, getStore, getComponent, getComponents, domNode) => {
  let App = getComponent(getSystem, getStore, getComponents, "App", "root")
  ReactDOM.render(<App/>, domNode)
}

/**
 * Creates a class component from a stateless one and wrap it with Error Boundary
 * to handle errors coming from a stateless component.
 */
const createClass = (getSystem, OriginalComponent) => class extends Component {
  render() {
    const { getComponent } = getSystem()
    const ErrorBoundary = getComponent("ErrorBoundary")

    return (
      <ErrorBoundary targetName={OriginalComponent?.name} getComponent={getComponent}>
        <OriginalComponent {...this.props} />
      </ErrorBoundary>
    )
  }
}

const wrapRender = (getSystem, component) => {
  const isStateless = component => !(component.prototype && component.prototype.isReactComponent)
  const target = isStateless(component) ? createClass(getSystem, component) : component
  const { render: oriRender} = target.prototype

  /**
   * This render method override handles errors that are throw in render method
   * of class components.
   */
  target.prototype.render = function render(...args) {
    try {
      return oriRender.apply(this, args)
    } catch (error) {
      const { getComponent } = getSystem()
      const Fallback = getComponent("Fallback")

      console.error(error) // eslint-disable-line no-console
      return <Fallback name={target.name} />
    }
  }

  return target
}

export const getComponent = (getSystem, getStore, getComponents, componentName, container, config = {}) => {

  if(typeof componentName !== "string")
    throw new TypeError("Need a string, to fetch a component. Was given a " + typeof componentName)

    // getComponent has a config object as a third, optional parameter
    // using the config object requires the presence of the second parameter, container
    // e.g. getComponent("JsonSchema_string_whatever", false, { failSilently: true })
  let component = getComponents(componentName)

  if(!component) {
    if (!config.failSilently) {
      getSystem().log.warn("Could not find component:", componentName)
    }
    return null
  }

  if(!container)
    return wrapRender(getSystem, component)

  if(container === "root")
    return makeContainer(getSystem, component, getStore())

  // container == truthy
  return makeContainer(getSystem, wrapRender(getSystem, component))
}
