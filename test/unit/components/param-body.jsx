import React from "react"
import expect from "expect"
import { mount } from "enzyme"
import { fromJS } from "immutable"
import ParamBody from "core/components/param-body"

describe("<ParamBody/>", () => {
  const baseFn = {
    inferSchema: () => ({}),
    getSampleSchema: () => "GENERATED_SAMPLE",
  }

  const baseSpecSelectors = {
    parameterWithMetaByIdentity: (pathMethod, param) => param,
    contentTypeValues: () => fromJS({ requestContentType: "application/json" }),
  }

  const fakeGetComponent = () => () => null

  const createProps = (overrides = {}) => ({
    fn: baseFn,
    getComponent: fakeGetComponent,
    specSelectors: baseSpecSelectors,
    pathMethod: ["/foo", "post"],
    consumes: fromJS(["application/json"]),
    consumesValue: "application/json",
    isExecute: false,
    onChange: jest.fn(),
    onChangeConsumes: jest.fn(),
    ...overrides,
  })

  it("emits the user-provided value when one is set", () => {
    const onChange = jest.fn()
    const props = createProps({
      param: fromJS({
        name: "body",
        in: "body",
        value: "{\"hello\":\"world\"}",
      }),
      onChange,
    })

    mount(<ParamBody {...props} />)

    expect(onChange).toHaveBeenCalledWith("{\"hello\":\"world\"}", false)
  })

  it("emits the generated sample when no value and no x-examples are present", () => {
    const onChange = jest.fn()
    const props = createProps({
      param: fromJS({
        name: "body",
        in: "body",
        schema: { type: "string" },
      }),
      onChange,
    })

    mount(<ParamBody {...props} />)

    expect(onChange).toHaveBeenCalledWith("GENERATED_SAMPLE", undefined)
  })

  it("prefers the x-examples 'default' value over the generated sample", () => {
    const onChange = jest.fn()
    const props = createProps({
      param: fromJS({
        name: "body",
        in: "body",
        schema: { type: "object" },
        "x-examples": {
          default: { targets: [1, 2, 3, 4] },
        },
      }),
      onChange,
    })

    mount(<ParamBody {...props} />)

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(
      JSON.stringify({ targets: [1, 2, 3, 4] }, null, 2),
      false
    )
  })

  it("falls back to the first x-examples entry when 'default' is missing", () => {
    const onChange = jest.fn()
    const props = createProps({
      param: fromJS({
        name: "body",
        in: "body",
        schema: { type: "object" },
        "x-examples": {
          first: { foo: "bar" },
          second: { baz: "qux" },
        },
      }),
      onChange,
    })

    mount(<ParamBody {...props} />)

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(
      JSON.stringify({ foo: "bar" }, null, 2),
      false
    )
  })

  it("uses string x-examples values verbatim", () => {
    const onChange = jest.fn()
    const props = createProps({
      param: fromJS({
        name: "body",
        in: "body",
        schema: { type: "string" },
        "x-examples": {
          default: "{\"targets\": \"[1, 2, 3, 4]\"}",
        },
      }),
      onChange,
    })

    mount(<ParamBody {...props} />)

    expect(onChange).toHaveBeenCalledWith(
      "{\"targets\": \"[1, 2, 3, 4]\"}",
      false
    )
  })

  it("ignores empty x-examples and falls back to the generated sample", () => {
    const onChange = jest.fn()
    const props = createProps({
      param: fromJS({
        name: "body",
        in: "body",
        schema: { type: "object" },
        "x-examples": {},
      }),
      onChange,
    })

    mount(<ParamBody {...props} />)

    expect(onChange).toHaveBeenCalledWith("GENERATED_SAMPLE", undefined)
  })
})
