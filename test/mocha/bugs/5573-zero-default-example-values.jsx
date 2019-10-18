/* eslint-env mocha */
import React from "react"
import { List, fromJS } from "immutable"
import expect, { createSpy } from "expect"
import { render } from "enzyme"
import ParameterRow from "components/parameter-row"

describe("bug #5573: zero default and example values", function(){
  it("should apply a Swagger 2.0 default value of zero", function(){
    const paramValue = fromJS({
      description: "a pet",
      type: "integer",
      default: 0
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
      onChange: createSpy(),
      param: paramValue,
      rawParam: paramValue,
      onChangeConsumes: () => {},
      pathMethod: [],
      getConfigs: () => { return {} },
      specPath: List([])
    }

    render(<ParameterRow {...props}/>)

    expect(props.onChange).toHaveBeenCalled()
    expect(props.onChange).toHaveBeenCalledWith(paramValue, "0", false)
  })
  it("should apply a Swagger 2.0 example value of zero", function() {
    const paramValue = fromJS({
      description: "a pet",
      type: "integer",
      schema: {
        example: 0
      }
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
      onChange: createSpy(),
      param: paramValue,
      rawParam: paramValue,
      onChangeConsumes: () => {},
      pathMethod: [],
      getConfigs: () => { return {} },
      specPath: List([])
    }

    render(<ParameterRow {...props}/>)

    expect(props.onChange).toHaveBeenCalled()
    expect(props.onChange).toHaveBeenCalledWith(paramValue, "0", false)
  })
  it("should apply an OpenAPI 3.0 default value of zero", function(){
    const paramValue = fromJS({
      description: "a pet",
      schema: {
        type: "integer",
        default: 0
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
      onChange: createSpy(),
      param: paramValue,
      rawParam: paramValue,
      onChangeConsumes: () => {},
      pathMethod: [],
      getConfigs: () => { return {} },
      specPath: List([])
    }

    render(<ParameterRow {...props}/>)

    expect(props.onChange).toHaveBeenCalled()
    expect(props.onChange).toHaveBeenCalledWith(paramValue, "0", false)
  })
  it("should apply an OpenAPI 3.0 example value of zero", function() {
    const paramValue = fromJS({
      description: "a pet",
      schema: {
        type: "integer",
        example: 0
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
      onChange: createSpy(),
      param: paramValue,
      rawParam: paramValue,
      onChangeConsumes: () => {},
      pathMethod: [],
      getConfigs: () => { return {} },
      specPath: List([])
    }

    render(<ParameterRow {...props}/>)

    expect(props.onChange).toHaveBeenCalled()
    expect(props.onChange).toHaveBeenCalledWith(paramValue, "0", false)
  })
})
