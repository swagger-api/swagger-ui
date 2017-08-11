import React, { Component } from "react"
import ReactDOM from "react-dom"
import { connect, Provider } from "react-redux"
import omit from "lodash/omit"

const SystemWrapper = (getSystem, ComponentToWrap ) => class extends Component {
  render() {
    return <ComponentToWrap {...getSystem() } {...this.props} {...this.context} />
  }
}

const RootWrapper = (reduxStore, ComponentToWrap) => class extends Component {
  render() {
    return (
      <Provider store={reduxStore}>
        <ComponentToWrap {...this.props} {...this.context} />
      </Provider>
    )
  }
}

const makeContainer = (getSystem, component, reduxStore) => {
  let wrappedWithSystem = SystemWrapper(getSystem, component, reduxStore)
  let connected = connect(state => ({state}))(wrappedWithSystem)
  if(reduxStore)
    return RootWrapper(reduxStore, connected)
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

    componentWillReceiveProps(nextProps) {
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
  let App = (getComponent(getSystem, getStore, getComponents, "App", "root"))
  ReactDOM.render(( <App/> ), domNode)
}

// Render try/catch wrapper
const createClass = component => class extends Component {
  render() {
    return component(this.props)
  }
}

const Fallback = ({ name }) => <div style={{ // eslint-disable-line react/prop-types
    padding: "1em",
    "color": "#aaa"
  }}>😱 <i>Could not render { name === "t" ? "this component" : name }, see the console.</i></div>

const wrapRender = (component) => {
  const isStateless = component => !(component.prototype && component.prototype.isReactComponent)

  const target = isStateless(component) ? createClass(component) : component

  const ori = target.prototype.render

  target.prototype.render = function render(...args) {
    try {
      return ori.apply(this, args)
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
      return <Fallback error={error} name={target.name} />
    }
  }

  return target
}


export const getComponent = (getSystem, getStore, getComponents, componentName, container) => {

  if(typeof componentName !== "string")
    throw new TypeError("Need a string, to fetch a component. Was given a " + typeof componentName)

  let component = getComponents(componentName)

  if(!component) {
    getSystem().log.warn("Could not find component", componentName)
    return null
  }

  if(!container)
    return wrapRender(component)

  if(container === "root")
    return makeContainer(getSystem, component, getStore())

  // container == truthy
  return makeContainer(getSystem, component)
}
