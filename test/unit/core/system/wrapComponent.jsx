import React from "react"

import { render } from "enzyme"
import System from "core/system"

describe("wrapComponents", () => {
  describe("should wrap a component and provide a reference to the original", () => {
    it("with stateless components", function () {
      // Given
      const system = new System({
        plugins: [
          {
            components: {
              wow: ({ name }) => <div>{name} component</div>
            }
          },
          {
            wrapComponents: {
              wow: (OriginalComponent) => (props) => {
                return <container>
                  <OriginalComponent {...props}></OriginalComponent>
                  <OriginalComponent name="Wrapped"></OriginalComponent>
                </container>
              }
            }
          }
        ]
      })

      // When
      let Component = system.getSystem().getComponents("wow")
      const wrapper = render(<Component name="Normal" />)

      expect(wrapper.get(0).name).toEqual("container")

      const children = wrapper.children()
      expect(children.length).toEqual(2)
      expect(children.eq(0).text()).toEqual("Normal component")
      expect(children.eq(1).text()).toEqual("Wrapped component")
    })

    it("with React classes", function () {
      class MyComponent extends React.Component {
        render() {
          return <div>{this.props.name} component</div>
        }
      }

      // Given
      const system = new System({
        plugins: [
          {
            components: {
              wow: MyComponent
            }
          },
          {
            wrapComponents: {
              wow: (OriginalComponent) => {
                return class WrapperComponent extends React.Component {
                  render() {
                    return <container>
                      <OriginalComponent {...this.props}></OriginalComponent>
                      <OriginalComponent name="Wrapped"></OriginalComponent>
                    </container>
                  }
                }
              }
            }
          }
        ]
      })

      // When
      let Component = system.getSystem().getComponents("wow")
      const wrapper = render(<Component name="Normal" />)

      expect(wrapper.get(0).name).toEqual("container")

      const children = wrapper.children()
      expect(children.length).toEqual(2)
      expect(children.eq(0).text()).toEqual("Normal component")
      expect(children.eq(1).text()).toEqual("Wrapped component")
    })
  })

  it("should provide a reference to the system to the wrapper", function () {

    // Given

    const mySystem = new System({
      plugins: [
        {
          // Make a selector
          statePlugins: {
            doge: {
              selectors: {
                wow: () => () => {
                  return "WOW much data"
                }
              }
            }
          }
        },
        {
          // Create a component
          components: {
            wow: () => <div>Original component</div>
          }
        },
        {
          // Wrap the component and use the system
          wrapComponents: {
            wow: (OriginalComponent, system) => (props) => {
              return <container>
                <OriginalComponent {...props}></OriginalComponent>
                <div>{system.dogeSelectors.wow()}</div>
              </container>
            }
          }
        }
      ]
    })

    // Then
    let Component = mySystem.getSystem().getComponents("wow")
    const wrapper = render(<Component name="Normal" />)

    expect(wrapper.get(0).name).toEqual("container")

    const children = wrapper.children()
    expect(children.length).toEqual(2)
    expect(children.eq(0).text()).toEqual("Original component")
    expect(children.eq(1).text()).toEqual("WOW much data")
  })

  it("should wrap correctly when registering more plugins", function () {

    // Given

    const mySystem = new System({
      plugins: [
        () => {
          return {
            statePlugins: {
              doge: {
                selectors: {
                  wow: () => () => {
                    return "WOW much data"
                  }
                }
              }
            },
            components: {
              wow: () => <div>Original component</div>
            }
          }
        }
      ]
    })

    mySystem.register([
      function () {
        return {
          // Wrap the component and use the system
          wrapComponents: {
            wow: (OriginalComponent, system) => (props) => {
              return <container>
                <OriginalComponent {...props}></OriginalComponent>
                <div>{system.dogeSelectors.wow()}</div>
              </container>
            }
          }
        }
      }
    ])

    // Then
    let Component = mySystem.getSystem().getComponents("wow")
    const wrapper = render(<Component name="Normal" />)

    expect(wrapper.get(0).name).toEqual("container")

    const children = wrapper.children()
    expect(children.length).toEqual(2)
    expect(children.eq(0).text()).toEqual("Original component")
    expect(children.eq(1).text()).toEqual("WOW much data")
  })

  it("should wrap correctly when registering multiple plugins targeting the same component", function () {

    // Given

    const mySystem = new System({
      pluginsOptions: {
        pluginLoadType: "chain"
      },
      plugins: [
        () => {
          return {
            components: {
              wow: () => <div>Original component</div>
            }
          }
        }
      ]
    })

    mySystem.register([
      () => {
        return {
          wrapComponents: {
            wow: (OriginalComponent, system) => (props) => {
              return <container1>
                <OriginalComponent {...props}></OriginalComponent>
                <div>Injected after</div>
              </container1>
            }
          }
        }
      },
      () => {
        return {
          wrapComponents: {
            wow: (OriginalComponent, system) => (props) => {
              return <container2>
                <div>Injected before</div>
                <OriginalComponent {...props}></OriginalComponent>
              </container2>
            }
          }
        }
      }
    ])

    // Then
    let Component = mySystem.getSystem().getComponents("wow")
    const wrapper = render(<Component name="Normal" />)

    expect(wrapper.get(0).name).toEqual("container2")

    const children2 = wrapper.children()
    expect(children2.length).toEqual(2)
    expect(children2[0].name).toEqual("div")
    expect(children2.eq(0).text()).toEqual("Injected before")
    expect(children2[1].name).toEqual("container1")

    const children1 = children2.children()
    expect(children1.length).toEqual(2)
    expect(children1.eq(0).text()).toEqual("Original component")
    expect(children1[0].name).toEqual("div")
    expect(children1.eq(1).text()).toEqual("Injected after")
  })

  it("should wrap correctly when building a system twice", function () {

    // Given

    const pluginOne = {
      statePlugins: {
        doge: {
          selectors: {
            wow: () => () => {
              return "WOW much data"
            }
          }
        }
      },
      components: {
        wow: () => <div>Original component</div>
      }
    }

    const pluginTwo = {
      // Wrap the component and use the system
      wrapComponents: {
        wow: (OriginalComponent, system) => (props) => {
          return <container>
            <OriginalComponent {...props}></OriginalComponent>
            <div>{system.dogeSelectors.wow()}</div>
          </container>
        }
      }
    }

    const bothPlugins = () => [pluginOne, pluginTwo]

    new System({
      plugins: bothPlugins
    })

    const secondSystem = new System({
      plugins: bothPlugins
    })

    // Then
    let Component = secondSystem.getSystem().getComponents("wow")
    const wrapper = render(<Component name="Normal" />)

    expect(wrapper.get(0).name).toEqual("container")

    const children = wrapper.children()
    expect(children.length).toEqual(2)
    expect(children.eq(0).text()).toEqual("Original component")
    expect(children.eq(1).text()).toEqual("WOW much data")
  })
})
