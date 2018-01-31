/* eslint-env mocha */
import expect, { createSpy } from "expect"
import { authorizeRequest } from "corePlugins/auth/actions"

describe("auth plugin - actions", () => {

  describe("authorizeRequest", () => {

    [
      [
        {
          oas3: true,
          server: "https://host/resource",
          scheme: "http",
          host: null,
          url: "http://specs/file",
        },
        "https://host/authorize"
      ],
      [
        {
          oas3: false,
          server: null,
          scheme: "https",
          host: undefined,
          url: "https://specs/file",
        },
        "https://specs/authorize"
      ],
      [
        {
          oas3: false,
          server: null,
          scheme: "https",
          host: "host",
          url: "http://specs/file",
        },
        "https://host/authorize"
      ],
    ].forEach(([{oas3, server, scheme, host, url}, expectedFetchUrl]) => {
      it("should resolve authorization endpoint against the server URL", () => {

        // Given
        const data = {
          url: "/authorize"
        }
        const system = {
          fn: {
            fetch: createSpy().andReturn(Promise.resolve())
          },
          getConfigs: () => ({}),
          authSelectors: {
            getConfigs: () => ({})
          },
          oas3Selectors: {
            selectedServer: () => server
          },
          specSelectors: {
            isOAS3: () => oas3,
            operationScheme: () => scheme,
            host: () => host,
            url: () => url
          }
        }

        // When
        authorizeRequest(data)(system)

        // Then
        expect(system.fn.fetch.calls.length).toEqual(1)
        expect(system.fn.fetch.calls[0].arguments[0]).toInclude({url: expectedFetchUrl})
      })
    })
  })
})
