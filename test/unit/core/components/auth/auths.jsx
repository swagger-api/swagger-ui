/**
 * @prettier
 */
import React from "react"
import { shallow } from "enzyme"
import { fromJS, Map } from "immutable"

import Auths from "core/components/auth/auths"

describe("<Auths/> logoutClick", function () {
  const dummyComponent = () => null
  const components = {
    AuthItem: dummyComponent,
    oauth2: dummyComponent,
    Button: dummyComponent,
  }
  const getComponentStub = (name) => components[name] || dummyComponent

  const buildProps = (definitions) => ({
    definitions,
    getComponent: getComponentStub,
    authSelectors: {
      authorized: () => Map(),
    },
    authActions: {
      logoutWithPersistOption: jest.fn(),
    },
    errSelectors: {},
    specSelectors: {},
  })

  it("sends only the scheme names to logoutWithPersistOption for a single-scheme map", function () {
    // The Authorize popup renders one <Auths/> per requirement group,
    // passing an Immutable.Map whose keys are the scheme names. The
    // Logout handler must emit those keys as a flat array of strings.
    const definitions = fromJS({
      ApiKeyAuth: { type: "apiKey", in: "header", name: "X-API-Key" },
    })
    const props = buildProps(definitions)
    const wrapper = shallow(<Auths {...props} />)

    wrapper.instance().logoutClick({ preventDefault: () => {} })

    expect(props.authActions.logoutWithPersistOption).toHaveBeenCalledWith([
      "ApiKeyAuth",
    ])
  })

  it("sends all scheme names when the map has several entries", function () {
    const definitions = fromJS({
      ApiKeyAuth: { type: "apiKey", in: "header", name: "X-API-Key" },
      BearerAuth: { type: "http", scheme: "bearer" },
    })
    const props = buildProps(definitions)
    const wrapper = shallow(<Auths {...props} />)

    wrapper.instance().logoutClick({ preventDefault: () => {} })

    expect(props.authActions.logoutWithPersistOption).toHaveBeenCalledWith([
      "ApiKeyAuth",
      "BearerAuth",
    ])
  })

  it("does not leak [key, value] pairs into the payload (guard against Immutable v4 toArray semantics)", function () {
    // `Map#toArray()` switched in Immutable v4 from values-only to
    // `[key, value]` pairs. The previous `.map((v, k) => k).toArray()`
    // pattern therefore emitted `[[name, schema]]` when a host bundled
    // Immutable v4+, which broke logout (see #10761). Guard the flat-
    // string shape regardless of Immutable version.
    const definitions = fromJS({
      ApiKeyAuth: { type: "apiKey", in: "header", name: "X-API-Key" },
    })
    const props = buildProps(definitions)
    const wrapper = shallow(<Auths {...props} />)

    wrapper.instance().logoutClick({ preventDefault: () => {} })

    const [payload] = props.authActions.logoutWithPersistOption.mock.calls[0]
    expect(Array.isArray(payload)).toBe(true)
    expect(payload).toHaveLength(1)
    expect(typeof payload[0]).toBe("string")
    expect(payload[0]).toBe("ApiKeyAuth")
  })
})
