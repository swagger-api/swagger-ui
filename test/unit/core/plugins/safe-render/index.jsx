import React from "react"
import { mount } from "enzyme"
import sinon from "sinon"
import { Provider } from "react-redux"
import noop from "lodash/noop"

import System from "core/system"
import ViewPlugin from "core/plugins/view"
import SafeRenderPlugin from "core/plugins/safe-render"

describe("safe-render", function() {
  const DisableComponentDidCatchPlugin = () => ({
    fn: {
      componentDidCatch: noop,
    }
  })

  it("should catch errors thrown inside of React Component class render method", function() {
    class BrokenComponent extends React.Component {
      render() {
        return null
      }
    }
    const BrokenComponentPlugin = () => {
      return {
        components: {
          BrokenComponent,
        }
      }
    }

    const system = new System({
      plugins: [
        ViewPlugin,
        BrokenComponentPlugin,
        SafeRenderPlugin({
          fullOverride: true,
          componentList: ["BrokenComponent"],
        }),
        DisableComponentDidCatchPlugin,
      ]
    })

    const SafeBrokenComponent = system.getSystem().getComponent("BrokenComponent")
    const wrapper = mount(<SafeBrokenComponent />)
    wrapper.find(BrokenComponent).simulateError(new Error("error"))

    expect(wrapper.text()).toEqual("😱 Could not render BrokenComponent, see the console.")
  })

  it("should catch errors thrown inside of PureComponent class render method", function() {
    class BrokenComponent extends React.PureComponent {
      render() {
        return null
      }
    }
    const BrokenComponentPlugin = () => {
      return {
        components: {
          BrokenComponent,
        }
      }
    }

    const system = new System({
      plugins: [
        ViewPlugin,
        BrokenComponentPlugin,
        SafeRenderPlugin({
          fullOverride: true,
          componentList: ["BrokenComponent"],
        }),
        DisableComponentDidCatchPlugin,
      ]
    })

    const SafeBrokenComponent = system.getSystem().getComponent("BrokenComponent")
    const wrapper = mount(<SafeBrokenComponent />)
    wrapper.find(BrokenComponent).simulateError(new Error("error"))

    expect(wrapper.text()).toEqual("😱 Could not render BrokenComponent, see the console.")
  })

  it("should catch errors thrown inside of function component", function() {
    const BrokenComponent = () => null
    const BrokenComponentPlugin = () => {
      return {
        components: {
          BrokenComponent,
        }
      }
    }

    const system = new System({
      plugins: [
        ViewPlugin,
        BrokenComponentPlugin,
        SafeRenderPlugin({
          fullOverride: true,
          componentList: ["BrokenComponent"],
        }),
        DisableComponentDidCatchPlugin,
      ]
    })

    const SafeBrokenComponent = system.getSystem().getComponent("BrokenComponent")
    const wrapper = mount(<SafeBrokenComponent />)
    wrapper.find(BrokenComponent).simulateError(new Error("error"))

    expect(wrapper.text()).toEqual("😱 Could not render BrokenComponent, see the console.")
  })

  it("should catch errors thrown inside of container created from React Component class", function() {
    class BrokenComponent extends React.Component {
      render() {
        return null
      }
    }
    const BrokenComponentPlugin = () => {
      return {
        components: {
          BrokenComponent,
        }
      }
    }

    const system = new System({
      plugins: [
        ViewPlugin,
        BrokenComponentPlugin,
        SafeRenderPlugin({
          fullOverride: true,
          componentList: ["BrokenComponent"],
        }),
        DisableComponentDidCatchPlugin,
      ]
    })

    const SafeBrokenComponent = system.getSystem().getComponent("BrokenComponent", true)
    const wrapper = mount(
      <Provider store={system.getStore()}>
        <SafeBrokenComponent />
      </Provider>
    )
    wrapper.find(BrokenComponent).simulateError(new Error("error"))

    expect(wrapper.text()).toEqual("😱 Could not render BrokenComponent, see the console.")
  })

  it("should catch errors thrown inside of container created from function component", function() {
    const BrokenComponent = () => null
    const BrokenComponentPlugin = () => {
      return {
        components: {
          BrokenComponent,
        }
      }
    }

    const system = new System({
      plugins: [
        ViewPlugin,
        BrokenComponentPlugin,
        SafeRenderPlugin({
          fullOverride: true,
          componentList: ["BrokenComponent"],
        }),
        DisableComponentDidCatchPlugin,
      ]
    })

    const SafeBrokenComponent = system.getSystem().getComponent("BrokenComponent", true)
    const wrapper = mount(
      <Provider store={system.getStore()}>
        <SafeBrokenComponent />
      </Provider>
    )
    wrapper.find(BrokenComponent).simulateError(new Error("error"))

    expect(wrapper.text()).toEqual("😱 Could not render BrokenComponent, see the console.")
  })

  it("should render custom Fallback component", function() {
    const BrokenComponent = () => null
    const BrokenComponentPlugin = () => {
      return {
        components: {
          BrokenComponent,
        }
      }
    }
    const FallbackPlugin = () => ({
      components: {
        Fallback: () => "fallback component",
      },
    })

    const system = new System({
      plugins: [
        ViewPlugin,
        BrokenComponentPlugin,
        SafeRenderPlugin({
          fullOverride: true,
          componentList: ["BrokenComponent"],
        }),
        FallbackPlugin,
        DisableComponentDidCatchPlugin,
      ]
    })

    const SafeBrokenComponent = system.getSystem().getComponent("BrokenComponent")
    const wrapper = mount(<SafeBrokenComponent />)
    wrapper.find(BrokenComponent).simulateError(new Error("error"))

    expect(wrapper.text()).toEqual("fallback component")
  })

  it("should call custom componentDidCatch hook", function() {
    const BrokenComponent = () => null
    const componentDidCatch = sinon.spy()

    const BrokenComponentPlugin = () => {
      return {
        components: {
          BrokenComponent,
        }
      }
    }
    const ComponentDidCatchPlugin = () => ({
      fn: {
        componentDidCatch,
      },
    })

    const system = new System({
      plugins: [
        ViewPlugin,
        BrokenComponentPlugin,
        SafeRenderPlugin({
          fullOverride: true,
          componentList: ["BrokenComponent"],
        }),
        ComponentDidCatchPlugin,
      ]
    })

    const SafeBrokenComponent = system.getSystem().getComponent("BrokenComponent")
    const wrapper = mount(<SafeBrokenComponent />)
    wrapper.find(BrokenComponent).simulateError(new Error("error"))

    expect(componentDidCatch.calledOnce).toBe(true)
  })
})
