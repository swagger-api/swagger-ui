import expect, { createSpy } from "expect"
import { loaded } from "corePlugins/swagger-js/configs-wrap-actions"

describe("swagger-js plugin - withCredentials", () => {
  it("should have no effect by default", () => {
    const system = {
      fn: {
        fetch: createSpy().andReturn(Promise.resolve())
      },
      getConfigs: () => ({})
    }
    const oriExecute = createSpy()

    const loadedFn = loaded(oriExecute, system)
    loadedFn()

    expect(oriExecute.calls.length).toBe(1)
    expect(system.fn.fetch.withCredentials).toBe(undefined)
  })

  it("should allow setting flag to true via config", () => {
    const system = {
      fn: {
        fetch: createSpy().andReturn(Promise.resolve())
      },
      getConfigs: () => ({
        withCredentials: true
      })
    }
    const oriExecute = createSpy()

    const loadedFn = loaded(oriExecute, system)
    loadedFn()

    expect(oriExecute.calls.length).toBe(1)
    expect(system.fn.fetch.withCredentials).toBe(true)
  })
  
  it("should allow setting flag to false via config", () => {
    const system = {
      fn: {
        fetch: createSpy().andReturn(Promise.resolve())
      },
      getConfigs: () => ({
        withCredentials: false
      })
    }
    const oriExecute = createSpy()

    const loadedFn = loaded(oriExecute, system)
    loadedFn()

    expect(oriExecute.calls.length).toBe(1)
    expect(system.fn.fetch.withCredentials).toBe(false)
  })
  
   it("should allow setting flag to true via config as string", () => {
    // for query string config
    const system = {
      fn: {
        fetch: createSpy().andReturn(Promise.resolve())
      },
      getConfigs: () => ({
        withCredentials: "true"
      })
    }
    const oriExecute = createSpy()

    const loadedFn = loaded(oriExecute, system)
    loadedFn()

    expect(oriExecute.calls.length).toBe(1)
    expect(system.fn.fetch.withCredentials).toBe(true)
  })
  
  it("should allow setting flag to false via config as string", () => {
    // for query string config
    const system = {
      fn: {
        fetch: createSpy().andReturn(Promise.resolve())
      },
      getConfigs: () => ({
        withCredentials: "false"
      })
    }
    const oriExecute = createSpy()

    const loadedFn = loaded(oriExecute, system)
    loadedFn()

    expect(oriExecute.calls.length).toBe(1)
    expect(system.fn.fetch.withCredentials).toBe(false)
  })
})
