/* eslint-env mocha */
import React, { PureComponent } from "react"
import expect from "expect"
import System from "core/system"
import { fromJS } from "immutable"
import { render } from "enzyme"
import ViewPlugin from "core/plugins/view/index.js"
import { connect, Provider } from "react-redux"

describe("bound system", function(){

  describe("wrapActions", function(){

    it("should replace an action", function(){
      // Given
      const system = new System({
        plugins: {
          statePlugins: {
            josh: {
              actions: {
                simple: () => {
                  return { type: "simple" }
                }
              },
              wrapActions: {
                simple: () => () => {
                  return { type: "newSimple" }
                }
              }
            }
          }
        }
      })

      // When
      var action = system.getSystem().joshActions.simple(1)
      expect(action).toEqual({
        type: "newSimple"
      })

    })

    it("should expose the original action, and the system as args", function(){
      // Given
      const simple = () => ({type: "simple" })
      const system = new System({
        plugins: {
          statePlugins: {
            josh: {
              actions: { simple },
              wrapActions: {
                simple: (oriAction, system) => (actionArg) => {
                  return {
                    type: "newSimple",
                    oriActionResult: oriAction(),
                    system: system.getSystem(),
                    actionArg
                  }
                }
              }
            }
          }
        }
      })

      // When
      var action = system.getSystem().joshActions.simple(1)
      expect(action).toEqual({
        type: "newSimple",
        oriActionResult: { type: "simple" },
        system: system.getSystem(),
        actionArg: 1
      })

    })

    it("should support multiple wraps of the same action", function(){
      const system = new System({
        plugins: [
          {
            statePlugins: {
              kyle: {
                actions: {
                  simple: () => {
                    return {
                      type: "simple",
                    }
                  }
                }
              }
            }
          },
          {
            statePlugins: {
              kyle: {
                wrapActions: {
                  simple: (ori) => () => {
                    return {
                      ...ori(),
                      firstWrap: true
                    }
                  }
                }
              }
            }
          },
          {
            statePlugins: {
              kyle: {
                wrapActions: {
                  simple: (ori) => () => {
                    return {
                      ...ori(),
                      secondWrap: true
                    }
                  }
                }
              }
            }
          }
        ]
      })

      // When
      var action = system.getSystem().kyleActions.simple(1)
      expect(action).toEqual({
        type: "simple",
        firstWrap: true,
        secondWrap: true,
      })

    })

    it("should execute wrapActions in the order they appear ( via plugins )", function(){
      const system = new System({
        plugins: [
          {
            statePlugins: {
              kyle: {
                actions: {
                  simple: () => {
                    return {
                      type: "one",
                    }
                  }
                }
              }
            }
          },
          {
            statePlugins: {
              kyle: {
                wrapActions: {
                  simple: (ori) => () => {
                    const obj = ori()
                    obj.type += "-two"
                    return obj
                  }
                }
              }
            }
          },
          {
            statePlugins: {
              kyle: {
                wrapActions: {
                  simple: (ori) => () => {
                    const obj = ori()
                    obj.type += "-three"
                    return obj
                  }
                }
              }
            }
          }
        ]
      })

      // When
      var action = system.getSystem().kyleActions.simple(1)
      expect(action.type).toEqual("one-two-three")

    })

    it("should have a the latest system", function(){
      // Given
      const system = new System({
        plugins: [
          {
            statePlugins: {
              kyle: {
                actions: {
                  simple: () => {
                    return {
                      type: "one",
                    }
                  }
                },
                wrapActions: {
                  simple: (ori, {joshActions}) => () => {
                    return joshActions.hello()
                  }
                }
              }
            }
          },
        ]
      })

      // When
      const kyleActions = system.getSystem().kyleActions

      system.register({
        statePlugins: {
          josh: {
            actions: {
              hello(){ return {type: "hello" } }
            }
          }
        }
      })

      const action = kyleActions.simple()
      expect(action).toEqual({ type: "hello"})
    })

    it.skip("should be able to create async actions", function(){
      const system = new System({
        plugins: [
          {
            statePlugins: {
              kyle: {
                actions: {
                  simple: () => {
                    return {
                      type: "one",
                    }
                  }
                }
              }
            }
          },
          {
            statePlugins: {
              kyle: {
                wrapActions: {
                  // eslint-disable-next-line no-unused-vars
                  simple: (ori) => (arg) => (sys) => {
                    return { type: "called" }
                  }
                }
              }
            }
          },
        ]
      })

      // When
      var action = system.getSystem().kyleActions.simple(1)
      expect(action.type).toEqual("called")

    })


  })

  describe("selectors", function(){

    it("should have the first arg be the nested state, and all other args to follow", function(){

      // Given
      const system = new System({
        state: {
          josh: {
            one: 1
          }
        },
        plugins: {
          statePlugins: {
            josh: {
              selectors: {
                simple: (state, arg1) => {
                  return { state, arg1 }
                }
              }
            }
          }
        }

      })

      // When
      var res = system.getSystem().joshSelectors.simple(1)
      expect(res).toEqual({
        state: fromJS({
          one: 1
        }),
        arg1: 1
      })

    })

    describe("when selector returns a funtcion", function(){

      it("should pass the system to that function", function(){

        // Given
        const system = new System({
          plugins: {
            statePlugins: {
              josh: {
                selectors: {
                  advanced: () => (mySystem) => {
                    // Then
                    expect(mySystem).toEqual(system.getSystem())
                    return "hi"
                  }
                }
              }
            }
          }

        })

        // When
        var res = system.getSystem().joshSelectors.advanced(1)
        expect(res).toEqual("hi")

      })

    })

    describe("wrapSelectors", () => {
      it("should wrap a selector and provide a reference to the original", function(){

        // Given
        const system = new System({
          plugins: [
            {
              statePlugins: {
                doge: {
                  selectors: {
                    wow: () => (system) => {
                      return "original"
                    }
                  }
                }
              }
            },
            {
              statePlugins: {
                doge: {
                  wrapSelectors: {
                    wow: (ori) => (system) => {
                      // Then
                      return ori() + " wrapper"
                    }
                  }
                }
              }
            }
          ]
        })

        // When
        var res = system.getSystem().dogeSelectors.wow(1)
        expect(res).toEqual("original wrapper")

      })

      it("should provide a live reference to the system to a wrapper", function(done){

        // Given
        const mySystem = new System({
          plugins: [
            {
              statePlugins: {
                doge: {
                  selectors: {
                    wow: () => (system) => {
                      return "original"
                    }
                  }
                }
              }
            },
            {
              statePlugins: {
                doge: {
                  wrapSelectors: {
                    wow: (ori, system) => () => {
                      // Then
                      expect(mySystem.getSystem()).toEqual(system.getSystem())
                      done()
                      return ori() + " wrapper"
                    }
                  }
                }
              }
            }
          ]
        })

        mySystem.getSystem().dogeSelectors.wow(1)
      })

      it("should provide the state as the first argument to the inner function", function(done){

        // Given
        const mySystem = new System({
          state: {
            doge: {
              abc: "123"
            }
          },
          plugins: [
            {
              statePlugins: {
                doge: {
                  selectors: {
                    wow: () => (system) => {
                      return "original"
                    }
                  }
                }
              }
            },
            {
              statePlugins: {
                doge: {
                  wrapSelectors: {
                    wow: (ori, system) => (dogeState) => {
                      // Then
                      expect(dogeState.toJS().abc).toEqual("123")
                      done()
                      return ori() + " wrapper"
                    }
                  }
                }
              }
            }
          ]
        })

        mySystem.getSystem().dogeSelectors.wow(1)
      })
    })

  })

  describe("getComponent", function() {
    it("returns a component from the system", function() {
      const system = new System({
        plugins: [
          ViewPlugin,
          {
            components: {
              test: ({ name }) => <div>{name} component</div>
            }
          }
        ]
      })

      // When
      var Component = system.getSystem().getComponent("test")
      const renderedComponent = render(<Component name="Test" />)
      expect(renderedComponent.text()).toEqual("Test component")
    })

    it("allows container components to provide their own `mapStateToProps` function", function() {
      // Given
      class ContainerComponent extends PureComponent {
        mapStateToProps(nextState, props) {
          return {
            "fromMapState": "This came from mapStateToProps"
          }
        }

        static defaultProps = {
          "fromMapState" : ""
        }

        render() {
          const { exampleSelectors, fromMapState, fromOwnProps } = this.props
          return (
            <div>{ fromMapState } {exampleSelectors.foo()} {fromOwnProps}</div>
          )
        }
      }
      const system = new System({
        plugins: [
          ViewPlugin,
          {
            components: {
              ContainerComponent
            }
          },
          {
            statePlugins: {
              example: {
                selectors: {
                  foo() { return "and this came from the system" }
                }
              }
            }
          }
        ]
      })

      // When
      var Component = system.getSystem().getComponent("ContainerComponent", true)
      const renderedComponent = render(
        <Provider store={system.getStore()}>
          <Component fromOwnProps="and this came from my own props" />
        </Provider>
      )

      // Then
      expect(renderedComponent.text()).toEqual("This came from mapStateToProps and this came from the system and this came from my own props")
    })

    it("gives the system and own props as props to a container's `mapStateToProps` function", function() {
      // Given
      class ContainerComponent extends PureComponent {
        mapStateToProps(nextState, props) {
          const { exampleSelectors, fromMapState, fromOwnProps } = props
          return {
            "fromMapState": `This came from mapStateToProps ${exampleSelectors.foo()} ${fromOwnProps}`
          }
        }

        static defaultProps = {
          "fromMapState" : ""
        }

        render() {
          const { fromMapState } = this.props
          return (
            <div>{ fromMapState }</div>
          )
        }
      }
      const system = new System({
        plugins: [
          ViewPlugin,
          {
            components: {
              ContainerComponent
            }
          },
          {
            statePlugins: {
              example: {
                selectors: {
                  foo() { return "and this came from the system" }
                }
              }
            }
          }
        ]
      })

      // When
      var Component = system.getSystem().getComponent("ContainerComponent", true)
      const renderedComponent = render(
        <Provider store={system.getStore()}>
          <Component fromOwnProps="and this came from my own props" />
        </Provider>
      )

      // Then
      expect(renderedComponent.text()).toEqual("This came from mapStateToProps and this came from the system and this came from my own props")
    })

    it("should catch errors thrown inside of React Component Class render methods", function() {
      // Given
      // eslint-disable-next-line react/require-render-return
      class BrokenComponent extends React.Component {
        render() {
          throw new Error("This component is broken")
        }
      }
      const system = new System({
        plugins: [
          ViewPlugin,
          {
            components: {
              BrokenComponent
            }
          }
        ]
      })

      // When
      var Component = system.getSystem().getComponent("BrokenComponent")
      const renderedComponent = render(<Component />)

      // Then
      expect(renderedComponent.text()).toEqual("😱 Could not render BrokenComponent, see the console.")
    })

    it("should catch errors thrown inside of pure component render methods", function() {
      // Given
      // eslint-disable-next-line react/require-render-return
      class BrokenComponent extends PureComponent {
        render() {
          throw new Error("This component is broken")
        }
      }

      const system = new System({
        plugins: [
          ViewPlugin,
          {
            components: {
              BrokenComponent
            }
          }
        ]
      })

      // When
      var Component = system.getSystem().getComponent("BrokenComponent")
      const renderedComponent = render(<Component />)

      // Then
      expect(renderedComponent.text()).toEqual("😱 Could not render BrokenComponent, see the console.")
    })

    it("should catch errors thrown inside of stateless component functions", function() {
      // Given
      // eslint-disable-next-line react/require-render-return
      let BrokenComponent = function BrokenComponent() { throw new Error("This component is broken") }
      const system = new System({
        plugins: [
          ViewPlugin,
          {
            components: {
              BrokenComponent
            }
          }
        ]
      })

      // When
      var Component = system.getSystem().getComponent("BrokenComponent")
      const renderedComponent = render(<Component />)

      // Then
      expect(renderedComponent.text().startsWith("😱 Could not render")).toEqual(true)
    })

    it("should catch errors thrown inside of container components", function() {
      // Given
      // eslint-disable-next-line react/require-render-return
      class BrokenComponent extends React.Component {
        render() {
          throw new Error("This component is broken")
        }
      }

      const system = new System({
        plugins: [
          ViewPlugin,
          {
            components: {
              BrokenComponent
            }
          }
        ]
      })

      // When
      var Component = system.getSystem().getComponent("BrokenComponent", true)
      const renderedComponent = render(
        <Provider store={system.getStore()}>
          <Component />
        </Provider>
      )

      // Then
      expect(renderedComponent.text()).toEqual("😱 Could not render BrokenComponent, see the console.")
    })
  })

})
