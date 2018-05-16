/* eslint-env mocha */
import React from "react"
import { List, fromJS } from "immutable"
import expect, { createSpy } from "expect"
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
        parameterWithMeta(){ return paramValue },
        isOAS3(){ return false }
      },
      operation: {get: ()=>{}},
      onChange: createSpy(),
      param: paramValue,
      onChangeConsumes: () => {},
      pathMethod: [],
      getConfigs: () => { return {} },
      specPath: List([])
    }

    render(<ParameterRow {...props}/>)

    expect(props.onChange).toHaveBeenCalledWith(paramValue, "MyDefaultValue")
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
        parameterWithMeta(){ return paramValue },
        isOAS3(){ return true }
      },
      operation: {get: ()=>{}},
      onChange: createSpy(),
      param: paramValue,
      onChangeConsumes: () => {},
      pathMethod: [],
      getConfigs: () => { return {} },
      specPath: List([])
    }

    render(<ParameterRow {...props}/>)

    expect(props.onChange).toHaveBeenCalledWith(paramValue, "MyDefaultValue")
  })
})
