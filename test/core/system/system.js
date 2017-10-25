/* eslint-env mocha */
import expect from "expect"
import System from "core/system"
import { fromJS } from "immutable"

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

})
