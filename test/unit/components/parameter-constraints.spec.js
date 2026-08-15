import React from "react"
import { shallow } from "enzyme"
import { fromJS } from "immutable"
import ParameterRow from "core/components/parameter-row"

describe("ParameterRow constraints", () => {
  const defaultProps = {
    onChange: jest.fn(),
    param: fromJS({ name: "test", in: "query" }),
    rawParam: fromJS({ name: "test", in: "query" }),
    getComponent: () => () => null,
    fn: {},
    isExecute: false,
    onChangeConsumes: jest.fn(),
    specSelectors: {
      isOAS3: () => false,
      isOAS31: () => false,
      parameterWithMetaByIdentity: () => fromJS({}),
      contentTypeValues: () => fromJS({}),
      consumesOptionsFor: () => fromJS([]),
      parameterInclusionSettingFor: () => false,
    },
    specActions: {},
    pathMethod: ["get", "/test"],
    getConfigs: () => ({ showExtensions: false, showCommonExtensions: false }),
    specPath: fromJS([]),
    oas3Actions: {},
    oas3Selectors: {
      activeExamplesMember: () => null,
    },
  }

  describe("OpenAPI 2.0/3.0 constraints (JSON Schema Draft 5)", () => {
    it("should display minimum constraint", () => {
      const schema = fromJS({
        type: "number",
        minimum: 1,
      })
      const props = {
        ...defaultProps,
        fn: {
          ...defaultProps.fn,
          stringifyConstraintNumberRange: jest.fn(() => "≥ 1"),
          getSampleSchema: jest.fn(),
          getSchemaObjectType: jest.fn(() => "number"),
          getSchemaObjectTypeLabel: jest.fn(() => "number"),
        },
        param: fromJS({
          name: "test",
          in: "query",
          schema: schema.toJS(),
        }),
      }

      const wrapper = shallow(<ParameterRow {...props} />)
      expect(props.fn.stringifyConstraintNumberRange).toHaveBeenCalledWith(schema)
      expect(wrapper.find('Markdown[className="parameter__constraint"]')).toHaveLength(1)
    })

    it("should display maximum constraint", () => {
      const schema = fromJS({
        type: "number",
        maximum: 100,
      })
      const props = {
        ...defaultProps,
        fn: {
          ...defaultProps.fn,
          stringifyConstraintNumberRange: jest.fn(() => "≤ 100"),
          getSampleSchema: jest.fn(),
          getSchemaObjectType: jest.fn(() => "number"),
          getSchemaObjectTypeLabel: jest.fn(() => "number"),
        },
        param: fromJS({
          name: "test",
          in: "query",
          schema: schema.toJS(),
        }),
      }

      const wrapper = shallow(<ParameterRow {...props} />)
      expect(props.fn.stringifyConstraintNumberRange).toHaveBeenCalledWith(schema)
      expect(wrapper.find('Markdown[className="parameter__constraint"]')).toHaveLength(1)
    })

    it("should display range constraint", () => {
      const schema = fromJS({
        type: "number",
        minimum: 1,
        maximum: 100,
      })
      const props = {
        ...defaultProps,
        fn: {
          ...defaultProps.fn,
          stringifyConstraintNumberRange: jest.fn(() => "[1, 100]"),
          getSampleSchema: jest.fn(),
          getSchemaObjectType: jest.fn(() => "number"),
          getSchemaObjectTypeLabel: jest.fn(() => "number"),
        },
        param: fromJS({
          name: "test",
          in: "query",
          schema: schema.toJS(),
        }),
      }

      const wrapper = shallow(<ParameterRow {...props} />)
      expect(props.fn.stringifyConstraintNumberRange).toHaveBeenCalledWith(schema)
      expect(wrapper.find('Markdown[className="parameter__constraint"]')).toHaveLength(1)
    })

    it("should display exclusive constraints (boolean style)", () => {
      const schema = fromJS({
        type: "number",
        minimum: 0,
        exclusiveMinimum: true,
        maximum: 100,
        exclusiveMaximum: true,
      })
      const props = {
        ...defaultProps,
        fn: {
          ...defaultProps.fn,
          stringifyConstraintNumberRange: jest.fn(() => "(0, 100)"),
          getSampleSchema: jest.fn(),
          getSchemaObjectType: jest.fn(() => "number"),
          getSchemaObjectTypeLabel: jest.fn(() => "number"),
        },
        param: fromJS({
          name: "test",
          in: "query",
          schema: schema.toJS(),
        }),
      }

      const wrapper = shallow(<ParameterRow {...props} />)
      expect(props.fn.stringifyConstraintNumberRange).toHaveBeenCalledWith(schema)
      expect(wrapper.find('Markdown[className="parameter__constraint"]')).toHaveLength(1)
    })

    it("should not display constraints when none exist", () => {
      const schema = fromJS({
        type: "string",
      })
      const props = {
        ...defaultProps,
        fn: {
          ...defaultProps.fn,
          stringifyConstraintNumberRange: jest.fn(() => null),
          getSampleSchema: jest.fn(),
          getSchemaObjectType: jest.fn(() => "string"),
          getSchemaObjectTypeLabel: jest.fn(() => "string"),
        },
        param: fromJS({
          name: "test",
          in: "query",
          schema: schema.toJS(),
        }),
      }

      const wrapper = shallow(<ParameterRow {...props} />)
      expect(props.fn.stringifyConstraintNumberRange).toHaveBeenCalledWith(schema)
      expect(wrapper.find('Markdown[className="parameter__constraint"]')).toHaveLength(0)
    })
  })

  describe("OpenAPI 3.1 constraints (JSON Schema 2020-12)", () => {
    it("should use jsonSchema202012 function for OAS 3.1", () => {
      const schema = fromJS({
        type: "number",
        exclusiveMinimum: 0,
        exclusiveMaximum: 100,
      })
      const props = {
        ...defaultProps,
        specSelectors: {
          ...defaultProps.specSelectors,
          isOAS31: () => true,
        },
        fn: {
          ...defaultProps.fn,
          jsonSchema202012: {
            stringifyConstraintNumberRange: jest.fn(() => "(0, 100)"),
          },
          getSampleSchema: jest.fn(),
          getSchemaObjectType: jest.fn(() => "number"),
          getSchemaObjectTypeLabel: jest.fn(() => "number"),
        },
        param: fromJS({
          name: "test",
          in: "query",
          schema: schema.toJS(),
        }),
      }

      const wrapper = shallow(<ParameterRow {...props} />)
      expect(props.fn.jsonSchema202012.stringifyConstraintNumberRange).toHaveBeenCalledWith(schema.toJS())
      expect(wrapper.find('Markdown[className="parameter__constraint"]')).toHaveLength(1)
    })

    it("should handle immutable to plain object conversion for OAS 3.1", () => {
      const schema = fromJS({
        type: "number",
        minimum: 1,
        maximum: 100,
      })
      const props = {
        ...defaultProps,
        specSelectors: {
          ...defaultProps.specSelectors,
          isOAS31: () => true,
        },
        fn: {
          ...defaultProps.fn,
          jsonSchema202012: {
            stringifyConstraintNumberRange: jest.fn(() => "[1, 100]"),
          },
          getSampleSchema: jest.fn(),
          getSchemaObjectType: jest.fn(() => "number"),
          getSchemaObjectTypeLabel: jest.fn(() => "number"),
        },
        param: fromJS({
          name: "test",
          in: "query",
          schema: schema.toJS(),
        }),
      }

      const wrapper = shallow(<ParameterRow {...props} />)
      // Verify the schema was converted to plain object
      const passedSchema = props.fn.jsonSchema202012.stringifyConstraintNumberRange.mock.calls[0][0]
      expect(passedSchema.toJS).toBeUndefined() // Should be plain object, not Immutable
      expect(passedSchema.minimum).toBe(1)
      expect(passedSchema.maximum).toBe(100)
    })
  })

  describe("fallback behavior", () => {
    it("should not crash when constraint functions are not available", () => {
      const schema = fromJS({
        type: "number",
        minimum: 1,
      })
      const props = {
        ...defaultProps,
        fn: {
          ...defaultProps.fn,
          getSampleSchema: jest.fn(),
          getSchemaObjectType: jest.fn(() => "number"),
          getSchemaObjectTypeLabel: jest.fn(() => "number"),
          // No stringifyConstraintNumberRange function
        },
        param: fromJS({
          name: "test",
          in: "query",
          schema: schema.toJS(),
        }),
      }

      expect(() => {
        const wrapper = shallow(<ParameterRow {...props} />)
        expect(wrapper.find('Markdown[className="parameter__constraint"]')).toHaveLength(0)
      }).not.toThrow()
    })

    it("should handle null schema gracefully", () => {
      const props = {
        ...defaultProps,
        fn: {
          ...defaultProps.fn,
          stringifyConstraintNumberRange: jest.fn(() => null),
          getSampleSchema: jest.fn(),
          getSchemaObjectType: jest.fn(() => null),
          getSchemaObjectTypeLabel: jest.fn(() => "unknown"),
        },
        param: fromJS({
          name: "test",
          in: "query",
        }),
      }

      expect(() => {
        const wrapper = shallow(<ParameterRow {...props} />)
        expect(wrapper.find('Markdown[className="parameter__constraint"]')).toHaveLength(0)
      }).not.toThrow()
    })
  })
})