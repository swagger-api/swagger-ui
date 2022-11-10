import { fromJS, OrderedMap } from "immutable"

import {
  selectedServer,
  serverVariableValue,
  serverVariables,
  serverEffectiveValue
} from "corePlugins/oas3/selectors"

import reducers from "corePlugins/oas3/reducers"

import {
  setSelectedServer,
  setServerVariableValue,
} from "corePlugins/oas3/actions"

describe("OAS3 plugin - state", function() {
  describe("action + reducer + selector integration", function() {
    describe("selectedServer", function() {
      it("should set and get a global selectedServer", function() {
        const state = new OrderedMap()
        const system = {
          // needed to handle `onlyOAS3` wrapper
          getSystem() {
            return {
              specSelectors: {
                specJson: () => {
                  return fromJS({ openapi: "3.0.0" })
                }
              }
            }
          }
        }

        // Create the action
        const action = setSelectedServer("http://google.com")

        // Collect the new state
        const newState = reducers["oas3_set_servers"](state, action)

        // Get the value with the selector
        const res = selectedServer(newState)(system)

        expect(res).toEqual("http://google.com")
      })

      it("should set and get a namespaced selectedServer", function() {
        const state = fromJS({
          selectedServer: "http://yahoo.com"
        })
        const system = {
          // needed to handle `onlyOAS3` wrapper
          getSystem() {
            return {
              specSelectors: {
                specJson: () => {
                  return fromJS({ openapi: "3.0.0" })
                }
              }
            }
          }
        }

        // Create the action
        const action = setSelectedServer("http://google.com", "myOperation")

        // Collect the new state
        const newState = reducers["oas3_set_servers"](state, action)

        // Get the value with the selector
        const res = selectedServer(newState, "myOperation")(system)

        // Get the global selected server
        const globalRes = selectedServer(newState)(system)

        expect(res).toEqual("http://google.com")
        expect(globalRes).toEqual("http://yahoo.com")
      })
    })

    describe("serverVariableValue", function() {
      it("should set and get a global serverVariableValue", function() {
        const state = new OrderedMap()
        const system = {
          // needed to handle `onlyOAS3` wrapper
          getSystem() {
            return {
              specSelectors: {
                specJson: () => {
                  return fromJS({ openapi: "3.0.0" })
                }
              }
            }
          }
        }

        // Create the action
        const action = setServerVariableValue({
          server: "google.com",
          key: "foo",
          val: "bar"
        })

        // Collect the new state
        const newState = reducers["oas3_set_server_variable_value"](state, action)

        // Get the value with the selector
        const res = serverVariableValue(newState, "google.com", "foo")(system)

        expect(res).toEqual("bar")
      })
      it("should set and get a namespaced serverVariableValue", function() {
        const state = fromJS({
          serverVariableValues: {
            "google.com": {
              foo: "123"
            }
          }
        })
        const system = {
          // needed to handle `onlyOAS3` wrapper
          getSystem() {
            return {
              specSelectors: {
                specJson: () => {
                  return fromJS({ openapi: "3.0.0" })
                }
              }
            }
          }
        }

        // Create the action
        const action = setServerVariableValue({
          namespace: "myOperation",
          server: "google.com",
          key: "foo",
          val: "bar"
        })

        // Collect the new state
        const newState = reducers["oas3_set_server_variable_value"](state, action)

        // Get the value with the selector
        const res = serverVariableValue(newState, {
          namespace: "myOperation",
          server: "google.com"
        }, "foo")(system)

        // Get the global value, to cross-check
        const globalRes = serverVariableValue(newState, {
          server: "google.com"
        }, "foo")(system)

        expect(res).toEqual("bar")
        expect(globalRes).toEqual("123")
      })
    })

    describe("serverVariables", function() {
      it("should set and get global serverVariables", function() {
        const state = new OrderedMap()
        const system = {
          // needed to handle `onlyOAS3` wrapper
          getSystem() {
            return {
              specSelectors: {
                specJson: () => {
                  return fromJS({ openapi: "3.0.0" })
                }
              }
            }
          }
        }

        // Create the action
        const action = setServerVariableValue({
          server: "google.com",
          key: "foo",
          val: "bar"
        })

        // Collect the new state
        const newState = reducers["oas3_set_server_variable_value"](state, action)

        // Get the value with the selector
        const res = serverVariables(newState, "google.com", "foo")(system)

        expect(res.toJS()).toEqual({
          foo: "bar"
        })
      })

      it("should set and get namespaced serverVariables", function() {
        const state = fromJS({
          serverVariableValues: {
            "google.com": {
              foo: "123"
            }
          }
        })

        const system = {
          // needed to handle `onlyOAS3` wrapper
          getSystem() {
            return {
              specSelectors: {
                specJson: () => {
                  return fromJS({ openapi: "3.0.0" })
                }
              }
            }
          }
        }

        // Create the action
        const action = setServerVariableValue({
          namespace: "myOperation",
          server: "google.com",
          key: "foo",
          val: "bar"
        })

        // Collect the new state
        const newState = reducers["oas3_set_server_variable_value"](state, action)

        // Get the value with the selector
        const res = serverVariables(newState, {
          namespace: "myOperation",
          server: "google.com"
        }, "foo")(system)

        // Get the global value, to cross-check
        const globalRes = serverVariables(newState, {
          server: "google.com"
        }, "foo")(system)

        expect(res.toJS()).toEqual({
          foo: "bar"
        })

        expect(globalRes.toJS()).toEqual({
          foo: "123"
        })
      })
    })
    describe("serverEffectiveValue", function() {
        it("should set variable values and compute a URL for a namespaced server", function() {
          const state = fromJS({
            serverVariableValues: {
              "google.com/{foo}": {
                foo: "123"
              }
            }
          })

          const system = {
            // needed to handle `onlyOAS3` wrapper
            getSystem() {
              return {
                specSelectors: {
                  specJson: () => {
                    return fromJS({ openapi: "3.0.0" })
                  }
                }
              }
            }
          }

          // Create the action
          const action = setServerVariableValue({
            namespace: "myOperation",
            server: "google.com/{foo}",
            key: "foo",
            val: "bar"
          })

          // Collect the new state
          const newState = reducers["oas3_set_server_variable_value"](state, action)

          // Get the value with the selector
          const res = serverEffectiveValue(newState, {
            namespace: "myOperation",
            server: "google.com/{foo}"
          })(system)

          // Get the global value, to cross-check
          const globalRes = serverEffectiveValue(newState, {
            server: "google.com/{foo}"
          })(system)

          expect(res).toEqual("google.com/bar")

          expect(globalRes).toEqual("google.com/123")
        })
      })

  })
  describe("selectors", function() {
    describe("serverEffectiveValue", function() {
      it("should compute global serverEffectiveValues", function() {
        const state = fromJS({
          serverVariableValues: {
            "google.com/{foo}/{bar}": {
              foo: "123",
              bar: "456"
            }
          }
        })
        const system = {
          // needed to handle `onlyOAS3` wrapper
          getSystem() {
            return {
              specSelectors: {
                specJson: () => {
                  return fromJS({ openapi: "3.0.0" })
                }
              }
            }
          }
        }

        // Get the value with the selector
        const res = serverEffectiveValue(state, "google.com/{foo}/{bar}")(system)

        expect(res).toEqual("google.com/123/456")
      })

      it("should handle multiple variable instances", function() {
        const state = fromJS({
          serverVariableValues: {
            "google.com/{foo}/{foo}/{bar}": {
              foo: "123",
              bar: "456"
            }
          }
        })
        const system = {
          // needed to handle `onlyOAS3` wrapper
          getSystem() {
            return {
              specSelectors: {
                specJson: () => {
                  return fromJS({ openapi: "3.0.0" })
                }
              }
            }
          }
        }

        // Get the value with the selector
        const res = serverEffectiveValue(state, "google.com/{foo}/{foo}/{bar}")(system)

        expect(res).toEqual("google.com/123/123/456")
      })
    })
  })
})
