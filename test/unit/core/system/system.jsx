import React, { PureComponent } from "react"
import { fromJS } from "immutable"
import { render, mount } from "enzyme"
import { Provider } from "react-redux"

import System from "core/system"
import ViewPlugin from "core/plugins/view/index.js"
import filterPlugin from "core/plugins/filter/index.js"

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
      let action = system.getSystem().joshActions.simple(1)
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
      let action = system.getSystem().joshActions.simple(1)
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
      let action = system.getSystem().kyleActions.simple(1)
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
      let action = system.getSystem().kyleActions.simple(1)
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
      let action = system.getSystem().kyleActions.simple(1)
      expect(action.type).toEqual("called")

    })


  })

  describe("fn", function() {

    it("should return helper functions", function () {
      // Given
      const system = new System({
        plugins: [
          filterPlugin
        ]
      })

      // When
      const fn = system.getSystem().fn.opsFilter
      expect(typeof fn).toEqual("function")
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
      let res = system.getSystem().joshSelectors.simple(1)
      expect(res).toEqual({
        state: fromJS({
          one: 1
        }),
        arg1: 1
      })

    })

    describe("when selector returns a function", function(){

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
        let res = system.getSystem().joshSelectors.advanced(1)
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
        let res = system.getSystem().dogeSelectors.wow(1)
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
      let Component = system.getSystem().getComponent("test")
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
      let Component = system.getSystem().getComponent("ContainerComponent", true)
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
      let Component = system.getSystem().getComponent("ContainerComponent", true)
      const renderedComponent = render(
        <Provider store={system.getStore()}>
          <Component fromOwnProps="and this came from my own props" />
        </Provider>
      )

      // Then
      expect(renderedComponent.text()).toEqual("This came from mapStateToProps and this came from the system and this came from my own props")
    })
  })

  describe("afterLoad", function() {
    it("should call a plugin's `afterLoad` method after the plugin is loaded", function() {
      // Given
      const system = new System({
        plugins: [
          {
            afterLoad(system) {
              this.rootInjects.wow = system.dogeSelectors.wow
            },
            statePlugins: {
              doge: {
                selectors: {
                  wow: () => (system) => {
                    return "so selective"
                  }
                }
              }
            }
          }
        ]
      })

      // When
      let res = system.getSystem().wow()
      expect(res).toEqual("so selective")
    })
    it("should call a preset plugin's `afterLoad` method after the plugin is loaded", function() {
      // Given
      const MyPlugin = {
        afterLoad(system) {
          this.rootInjects.wow = system.dogeSelectors.wow
        },
        statePlugins: {
          doge: {
            selectors: {
              wow: () => (system) => {
                return "so selective"
              }
            }
          }
        }
      }

      const system = new System({
        plugins: [
          [MyPlugin]
        ]
      })

      // When
      let res = system.getSystem().wow()
      expect(res).toEqual("so selective")
    })
    it("should call a function preset plugin's `afterLoad` method after the plugin is loaded", function() {
      // Given
      const MyPlugin = {
        afterLoad(system) {
          this.rootInjects.wow = system.dogeSelectors.wow
        },
        statePlugins: {
          doge: {
            selectors: {
              wow: () => (system) => {
                return "so selective"
              }
            }
          }
        }
      }

      const system = new System({
        plugins: [
          () => {
            return [MyPlugin]
          }
        ]
      })

      // When
      let res = system.getSystem().wow()
      expect(res).toEqual("so selective")
    })
    it("should call a registered plugin's `afterLoad` method after the plugin is loaded", function() {
      // Given
      const MyPlugin = {
        afterLoad(system) {
          this.rootInjects.wow = system.dogeSelectors.wow
        },
        statePlugins: {
          doge: {
            selectors: {
              wow: () => (system) => {
                return "so selective"
              }
            }
          }
        }
      }

      const system = new System({
        plugins: []
      })

      system.register([MyPlugin])

      // When
      let res = system.getSystem().wow()
      expect(res).toEqual("so selective")
    })
  })

  describe("rootInjects", function() {
    it("should attach a rootInject function as an instance method", function() {
      // This is the same thing as the `afterLoad` tests, but is here for posterity

      // Given
      const system = new System({
        plugins: [
          {
            afterLoad(system) {
              this.rootInjects.wow = system.dogeSelectors.wow
            },
            statePlugins: {
              doge: {
                selectors: {
                  wow: () => (system) => {
                    return "so selective"
                  }
                }
              }
            }
          }
        ]
      })

      // When
      let res = system.getSystem().wow()
      expect(res).toEqual("so selective")
    })
  })

  describe("error catching", function() {
    it("should encapsulate thrown errors in an afterLoad method", function() {
      // Given
      const ThrowyPlugin = {
        afterLoad(system) {
          throw new Error("afterLoad BREAKS STUFF!")
        },
        statePlugins: {
          doge: {
            selectors: {
              wow: () => (system) => {
                return "so selective"
              }
            }
          }
        }
      }

      const system = new System({
        plugins: []
      })


      // When
      expect(() => {
        system.register([ThrowyPlugin])
        // let resSystem = system.getSystem()
      }).not.toThrow()
    })

    it("should encapsulate thrown errors in an action creator", function(){

      // Given
      const system = new System({
        plugins: {
          statePlugins: {
            throw: {
              actions: {
                func() {
                  throw new Error("this action creator THROWS!")
                }
              }
            }
          }
        }

      })

      expect(() => {
        // TODO: fix existing action error catcher that creates THROWN ERR actions
        system.getSystem().throwActions.func()
      }).not.toThrow()
    })

    it("should encapsulate thrown errors in a reducer", function(){

      // Given
      const system = new System({
        plugins: {
          statePlugins: {
            throw: {
              actions: {
                func: () => {
                  return {
                    type: "THROW_FUNC",
                    payload: "BOOM!"
                  }
                }
              },
              reducers: {
                "THROW_FUNC": (state, action) => {
                  throw new Error("this reducer EXPLODES!")
                }
              }
            }
          }
        }

      })

      expect(() => {
        system.getSystem().throwActions.func()
      }).not.toThrow()
    })

    it("should encapsulate thrown errors in a selector", function(){

      // Given
      const system = new System({
        plugins: {
          statePlugins: {
            throw: {
              selectors: {
                func: (state, arg1) => {
                  throw new Error("this selector THROWS!")
                }
              }
            }
          }
        }

      })

      expect(system.getSystem().throwSelectors.func).not.toThrow()
    })

    it("should encapsulate thrown errors in a complex selector", function(){

      // Given
      const system = new System({
        plugins: {
          statePlugins: {
            throw: {
              selectors: {
                func: (state, arg1) => system => {
                  throw new Error("this selector THROWS!")
                }
              }
            }
          }
        }

      })

      expect(system.getSystem().throwSelectors.func).not.toThrow()
    })

    it("should encapsulate thrown errors in a wrapAction", function(){

      // Given
      const system = new System({
        plugins: {
          statePlugins: {
            throw: {
              actions: {
                func: () => {
                  return {
                    type: "THROW_FUNC",
                    payload: "this original action does NOT throw"
                  }
                }
              },
              wrapActions: {
                func: (ori) => (...args) => {
                  throw new Error("this wrapAction UNRAVELS EVERYTHING!")
                }
              }
            }
          }
        }

      })

      expect(system.getSystem().throwActions.func).not.toThrow()
    })

    it("should encapsulate thrown errors in a wrapSelector", function(){

      // Given
      const system = new System({
        plugins: {
          statePlugins: {
            throw: {
              selectors: {
                func: (state, arg1) => {
                  return 123
                }
              },
              wrapSelectors: {
                func: (ori) => (...props) => {
                  return ori(...props)
                }
              }
            }
          }
        }

      })

      expect(system.getSystem().throwSelectors.func).not.toThrow()
    })
  })
})
