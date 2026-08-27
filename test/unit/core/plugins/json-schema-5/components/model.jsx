import React from "react"
import { shallow } from "enzyme"
import { fromJS } from "immutable"
import Model from "core/plugins/json-schema-5/components/model"

describe("<Model />", function() {
  const ObjectModel = () => null
  const ArrayModel = () => null
  const PrimitiveModel = () => null

  const getComponent = (componentName) => {
    return {
      ObjectModel,
      ArrayModel,
      PrimitiveModel,
    }[componentName]
  }

  const props = {
    getComponent,
    getConfigs: () => ({}),
    specSelectors: {
      isOAS3: () => true,
      findDefinition: () => fromJS({ type: "object" }),
    },
    specPath: fromJS([]),
  }

  it("derives model name from unresolved $ref", function() {
    const wrapper = shallow(
      <Model {...props} schema={fromJS({ $ref: "#/components/schemas/Links" })} />
    )

    const renderedObjectModel = wrapper.find(ObjectModel)
    expect(renderedObjectModel.length).toEqual(1)
    expect(renderedObjectModel.first().prop("name")).toEqual("Links")
  })
})
