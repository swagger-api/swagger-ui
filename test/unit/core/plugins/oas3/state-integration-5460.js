/**
 * @prettier
 */
// Regression coverage for https://github.com/swagger-api/swagger-ui/issues/5460
//
// The bug: switching media-types did not refresh the displayed Example Value
// when the active example key from the previous media type no longer existed
// in the new one. This is a state-shape test that documents the contract
// between media-type and active-example state: the active-example key is not
// cleared by `setRequestContentType`, so the UI layer is responsible for
// fixing up the stale key when the underlying `examples` change. See
// `ExamplesSelect.UNSAFE_componentWillReceiveProps`.

import { fromJS } from "immutable"

import reducers from "core/plugins/oas3/reducers"
import {
  activeExamplesMember,
  requestContentType,
} from "core/plugins/oas3/selectors"
import {
  setActiveExamplesMember,
  setRequestContentType,
} from "core/plugins/oas3/actions"

const oas3System = {
  getSystem() {
    return {
      specSelectors: {
        specJson: () => fromJS({ openapi: "3.0.2" }),
        isOAS3: () => true,
      },
    }
  },
}

describe("#5460 state integration: media-type switch and active example member", () => {
  it("should record the active example member for the request body", () => {
    let state = fromJS({})

    state = reducers["oas3_set_request_content_type"](
      state,
      setRequestContentType({
        value: "application/json",
        pathMethod: ["/foo", "post"],
      })
    )
    state = reducers["oas3_set_active_examples_member"](
      state,
      setActiveExamplesMember({
        name: "bar_json",
        pathMethod: ["/foo", "post"],
        contextType: "requestBody",
        contextName: "requestBody",
      })
    )

    expect(requestContentType(state, "/foo", "post")(oas3System)).toEqual(
      "application/json"
    )
    expect(
      activeExamplesMember(
        state,
        "/foo",
        "post",
        "requestBody",
        "requestBody"
      )(oas3System)
    ).toEqual("bar_json")
  })

  it("should NOT clear the active example member when only the request content type changes", () => {
    // This documents the existing state-shape: setRequestContentType does not
    // touch the active-example key. The UI layer is responsible for
    // reconciling the stale key when the examples Map changes.
    let state = fromJS({})

    state = reducers["oas3_set_request_content_type"](
      state,
      setRequestContentType({
        value: "application/json",
        pathMethod: ["/foo", "post"],
      })
    )
    state = reducers["oas3_set_active_examples_member"](
      state,
      setActiveExamplesMember({
        name: "bar_json",
        pathMethod: ["/foo", "post"],
        contextType: "requestBody",
        contextName: "requestBody",
      })
    )
    // user switches to application/xml
    state = reducers["oas3_set_request_content_type"](
      state,
      setRequestContentType({
        value: "application/xml",
        pathMethod: ["/foo", "post"],
      })
    )

    expect(requestContentType(state, "/foo", "post")(oas3System)).toEqual(
      "application/xml"
    )
    // active example key is intentionally retained at the reducer level
    expect(
      activeExamplesMember(
        state,
        "/foo",
        "post",
        "requestBody",
        "requestBody"
      )(oas3System)
    ).toEqual("bar_json")
  })

  it("should update the active example member after the synthetic onSelect from the UI", () => {
    // Simulates what `ExamplesSelect.UNSAFE_componentWillReceiveProps` does
    // when the previous active example key is no longer in the new examples
    // Map: it fires `_onSelect(firstExampleKey, { isSyntheticChange: true })`,
    // which dispatches `setActiveExamplesMember` for the new media type.
    let state = fromJS({})

    state = reducers["oas3_set_active_examples_member"](
      state,
      setActiveExamplesMember({
        name: "bar_json",
        pathMethod: ["/foo", "post"],
        contextType: "requestBody",
        contextName: "requestBody",
      })
    )
    // media-type switched; UI synthetically updates active example
    state = reducers["oas3_set_active_examples_member"](
      state,
      setActiveExamplesMember({
        name: "foo_xml",
        pathMethod: ["/foo", "post"],
        contextType: "requestBody",
        contextName: "requestBody",
      })
    )

    expect(
      activeExamplesMember(
        state,
        "/foo",
        "post",
        "requestBody",
        "requestBody"
      )(oas3System)
    ).toEqual("foo_xml")
  })
})
