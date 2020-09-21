import React from "react"
import { fromJS } from "immutable"
import { render } from "enzyme"
import ParameterRow from "components/parameter-row"

describe("<ParameterRow/>", () => {
  const createProps = ({ param, isOAS3 }) => ({
    getComponent: () => "div",
    specSelectors: {
      parameterWithMetaByIdentity: () => param,
      isOAS3: () => isOAS3,
      isSwagger2: () => !isOAS3
    },
    oas3Selectors: { activeExamplesMember: () => {} },
    param,
    rawParam: param,
    pathMethod: [],
    getConfigs: () => ({})
  })

  it("Can render Swagger 2 parameter type with format", () => {
    const param = fromJS({
      name: "petUuid",
      in: "path",
      description: "UUID that identifies a pet",
      type: "string",
      format: "uuid"
    })

    const props = createProps({ param, isOAS3: false })
    const wrapper = render(<ParameterRow {...props}/>)

    expect(wrapper.find(".parameter__type").length).toEqual(1)
    expect(wrapper.find(".parameter__type").text()).toEqual("string($uuid)")
  })

  it("Can render Swagger 2 parameter type without format", () => {
    const param = fromJS({
      name: "petId",
      in: "path",
      description: "ID that identifies a pet",
      type: "string"
    })

    const props = createProps({ param, isOAS3: false })
    const wrapper = render(<ParameterRow {...props}/>)

    expect(wrapper.find(".parameter__type").length).toEqual(1)
    expect(wrapper.find(".parameter__type").text()).toEqual("string")
  })

  it("Can render OAS3 parameter type with format", () => {
    const param = fromJS({
      name: "petUuid",
      in: "path",
      description: "UUID that identifies a pet",
      schema: {
        type: "string",
        format: "uuid"
      }
    })

    const props = createProps({ param, isOAS3: true })
    const wrapper = render(<ParameterRow {...props}/>)

    expect(wrapper.find(".parameter__type").length).toEqual(1)
    expect(wrapper.find(".parameter__type").text()).toEqual("string($uuid)")
  })

  it("Can render OAS3 parameter type without format", () => {
    const param = fromJS({
      name: "petId",
      in: "path",
      description: "ID that identifies a pet",
      schema: {
        type: "string"
      }
    })

    const props = createProps({ param, isOAS3: true })
    const wrapper = render(<ParameterRow {...props}/>)

    expect(wrapper.find(".parameter__type").length).toEqual(1)
    expect(wrapper.find(".parameter__type").text()).toEqual("string")
  })
})
