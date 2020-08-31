
import React from "react"
import { List, fromJS } from "immutable"

import { render } from "enzyme"
import ParameterRow from "components/parameter-row"

describe("bug #4557: default parameter values", function(){
  it("should apply a Swagger 2.0 default value", function(){

    const paramValue = fromJS({
      description: "a pet",
      type: "string",
      default: "MyDefaultValue"
    })

    let props = {
      getComponent: ()=> "div",
      specSelectors: {
        security(){},
        parameterWithMetaByIdentity(){ return paramValue },
        isOAS3(){ return false },
        isSwagger2(){ return true }
      },
      fn: {},
      operation: {get: ()=>{}},
      onChange: jest.fn(),
      param: paramValue,
      rawParam: paramValue,
      onChangeConsumes: () => {},
      pathMethod: [],
      getConfigs: () => { return {} },
      specPath: List([])
    }

    render(<ParameterRow {...props}/>)

    expect(props.onChange).toHaveBeenCalled()
    expect(props.onChange).toHaveBeenCalledWith(paramValue, "MyDefaultValue", false)
  })
  it("should apply an OpenAPI 3.0 default value", function(){

    const paramValue = fromJS({
      description: "a pet",
      schema: {
        type: "string",
        default: "MyDefaultValue"
      }
    })

    let props = {
      getComponent: ()=> "div",
      specSelectors: {
        security(){},
        parameterWithMetaByIdentity(){ return paramValue },
        isOAS3(){ return true },
        isSwagger2() { return false }
      },
      oas3Selectors: {
        activeExamplesMember: () => null
      },
      fn: {},
      operation: {get: ()=>{}},
      onChange: jest.fn(),
      param: paramValue,
      rawParam: paramValue,
      onChangeConsumes: () => {},
      pathMethod: [],
      getConfigs: () => { return {} },
      specPath: List([])
    }

    render(<ParameterRow {...props}/>)

    expect(props.onChange).toHaveBeenCalled()
    expect(props.onChange).toHaveBeenCalledWith(paramValue, "MyDefaultValue", false)
  })
})
