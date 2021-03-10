import { fromJS } from "immutable"
import { createXMLExample, sampleFromSchema, memoizedCreateXMLExample, memoizedSampleFromSchema } from "corePlugins/samples/fn"

describe("sampleFromSchema", () => {
  it("handles Immutable.js objects for nested schemas", function () {
    let definition = fromJS({
      "type": "object",
      "properties": {
        "json": {
          "type": "object",
          "example": {
            "a": "string"
          },
          "properties": {
            "a": {
              "type": "string"
            }
          }
        }
      }
    })

    let expected = {
      json: {
        a: "string"
      }
    }

    expect(sampleFromSchema(definition, { includeReadOnly: false })).toEqual(expected)
  })

  it("should return first enum value if only enum is provided", function () {
    let definition = fromJS({
      enum: ["probe"]
    })

    let expected = "probe"
    expect(sampleFromSchema(definition, { includeReadOnly: false })).toEqual(expected)
  })

  it("combine first oneOf or anyOf with schema's definitions", function () {
    let definition = {
      type: "object",
      anyOf: [
        {
          type: "object",
          properties: {
            test2: {
              type: "string",
              example: "anyOf"
            },
            test: {
              type: "string",
              example: "anyOf"
            }
          }
        }
      ],
      properties: {
        test: {
          type: "string",
          example: "schema"
        }
      }
    }

    let expected = {
      test: "schema",
      test2: "anyOf"
    }

    expect(sampleFromSchema(definition, { includeReadOnly: false })).toEqual(expected)

    definition = {
      type: "object",
      oneOf: [
        {
          type: "object",
          properties: {
            test2: {
              type: "string",
              example: "oneOf"
            },
            test: {
              type: "string",
              example: "oneOf"
            }
          }
        }
      ],
      properties: {
        test: {
          type: "string",
          example: "schema"
        }
      }
    }

    expected = {
      test: "schema",
      test2: "oneOf"
    }

    expect(sampleFromSchema(definition, { includeReadOnly: false })).toEqual(expected)
  })

  it("returns object with no readonly fields for parameter", function () {
    let definition = {
      type: "object",
      properties: {
        id: {
          type: "integer"
        },
        readOnlyDog: {
          readOnly: true,
          type: "string"
        }
      },
      xml: {
        name: "animals"
      }
    }

    let expected = {
      id: 0
    }

    expect(sampleFromSchema(definition, { includeReadOnly: false })).toEqual(expected)
  })

  it("returns object with readonly fields for parameter, with includeReadOnly", function () {
    let definition = {
      type: "object",
      properties: {
        id: {
          type: "integer"
        },
        readOnlyDog: {
          readOnly: true,
          type: "string"
        }
      },
      xml: {
        name: "animals"
      }
    }

    let expected = {
      id: 0,
      readOnlyDog: "string"
    }

    expect(sampleFromSchema(definition, { includeReadOnly: true })).toEqual(expected)
  })

  it("returns object without deprecated fields for parameter", function () {
    let definition = {
      type: "object",
      properties: {
        id: {
          type: "integer"
        },
        deprecatedProperty: {
          deprecated: true,
          type: "string"
        }
      },
      xml: {
        name: "animals"
      }
    }

    let expected = {
      id: 0
    }

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("returns object without writeonly fields for parameter", function () {
    let definition = {
      type: "object",
      properties: {
        id: {
          type: "integer"
        },
        writeOnlyDog: {
          writeOnly: true,
          type: "string"
        }
      },
      xml: {
        name: "animals"
      }
    }

    let expected = {
      id: 0
    }

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("returns object with writeonly fields for parameter, with includeWriteOnly", function () {
    let definition = {
      type: "object",
      properties: {
        id: {
          type: "integer"
        },
        writeOnlyDog: {
          writeOnly: true,
          type: "string"
        }
      },
      xml: {
        name: "animals"
      }
    }

    let expected = {
      id: 0,
      writeOnlyDog: "string"
    }

    expect(sampleFromSchema(definition, { includeWriteOnly: true })).toEqual(expected)
  })

  it("returns object without any $$ref fields at the root schema level", function () {
    let definition = {
    type: "object",
    properties: {
      message: {
        type: "string"
      }
    },
    example: {
      value: {
        message: "Hello, World!"
      },
      $$ref: "#/components/examples/WelcomeExample"
    },
    $$ref: "#/components/schemas/Welcome"
  }

    let expected = {
      "value": {
        "message": "Hello, World!"
      }
    }

    expect(sampleFromSchema(definition, { includeWriteOnly: true })).toEqual(expected)
  })

  it("returns object without any $$ref fields at nested schema levels", function () {
    let definition = {
      type: "object",
      properties: {
        message: {
          type: "string"
        }
      },
      example: {
        a: {
          value: {
            message: "Hello, World!"
          },
          $$ref: "#/components/examples/WelcomeExample"
        }
      },
      $$ref: "#/components/schemas/Welcome"
    }

    let expected = {
      a: {
        "value": {
          "message": "Hello, World!"
        }
      }
    }

    expect(sampleFromSchema(definition, { includeWriteOnly: true })).toEqual(expected)
  })

  it("returns object with any $$ref fields that appear to be user-created", function () {
    let definition = {
      type: "object",
      properties: {
        message: {
          type: "string"
        }
      },
      example: {
        $$ref: {
          value: {
            message: "Hello, World!"
          },
          $$ref: "#/components/examples/WelcomeExample"
        }
      },
      $$ref: "#/components/schemas/Welcome"
    }

    let expected = {
      $$ref: {
        "value": {
          "message": "Hello, World!"
        }
      }
    }

    expect(sampleFromSchema(definition, { includeWriteOnly: true })).toEqual(expected)
  })

  it("returns example value for date-time property", () => {
    let definition = {
      type: "string",
      format: "date-time"
    }

    // 0-20 chops off milliseconds
    // necessary because test latency can cause failures
    // it would be better to mock Date globally and expect a string - KS 11/18
    let expected = new Date().toISOString().substring(0, 20)

    expect(sampleFromSchema(definition)).toContain(expected)
  })

  it("returns example value for date property", () => {
    let definition = {
      type: "string",
      format: "date"
    }

    let expected = new Date().toISOString().substring(0, 10)

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("returns a UUID for a string with format=uuid", () => {
    let definition = {
      type: "string",
      format: "uuid"
    }

    let expected = "3fa85f64-5717-4562-b3fc-2c963f66afa6"

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("returns a hostname for a string with format=hostname", () => {
    let definition = {
      type: "string",
      format: "hostname"
    }

    let expected = "example.com"

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("returns an IPv4 address for a string with format=ipv4", () => {
    let definition = {
      type: "string",
      format: "ipv4"
    }

    let expected = "198.51.100.42"

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("returns an IPv6 address for a string with format=ipv6", () => {
    let definition = {
      type: "string",
      format: "ipv6"
    }

    let expected = "2001:0db8:5b96:0000:0000:426f:8e17:642a"

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  describe("for array type", () => {
    it("returns array with sample of array type", () => {
      let definition = {
        type: "array",
        items: {
          type: "integer"
        }
      }

      let expected = [ 0 ]

      expect(sampleFromSchema(definition)).toEqual(expected)
    })

    it("returns string for example for array that has example of type string", () => {
      let definition = {
        type: "array",
        items: {
          type: "string"
        },
        example: "dog"
      }

      let expected = "dog"

      expect(sampleFromSchema(definition)).toEqual(expected)
    })

    it("returns array of examples for array that has examples", () => {
      let definition = {
        type: "array",
        items: {
          type: "string",
        },
        example: [ "dog", "cat" ]
      }

      let expected = [ "dog", "cat" ]

      expect(sampleFromSchema(definition)).toEqual(expected)
    })

    it("returns array of samples for oneOf type", () => {
      let definition = {
        type: "array",
        items: {
          type: "string",
          oneOf: [
            {
              type: "integer"
            }
          ]
        }
      }

      let expected = [ 0 ]

      expect(sampleFromSchema(definition)).toEqual(expected)
    })

    it("returns array of samples for oneOf types", () => {
      let definition = {
        type: "array",
        items: {
          type: "string",
          oneOf: [
            {
              type: "string"
            },
            {
              type: "integer"
            }
          ]
        }
      }

      let expected = [ "string", 0 ]

      expect(sampleFromSchema(definition)).toEqual(expected)
    })

    it("returns array of samples for oneOf examples", () => {
      let definition = {
        type: "array",
        items: {
          type: "string",
          oneOf: [
            {
              type: "string",
              example: "dog"
            },
            {
              type: "integer",
              example: 1
            }
          ]
        }
      }

      let expected = [ "dog", 1 ]

      expect(sampleFromSchema(definition)).toEqual(expected)
    })

    it("returns array of samples for anyOf type", () => {
      let definition = {
        type: "array",
        items: {
          type: "string",
          anyOf: [
            {
              type: "integer"
            }
          ]
        }
      }

      let expected = [ 0 ]

      expect(sampleFromSchema(definition)).toEqual(expected)
    })

    it("returns array of samples for anyOf types", () => {
      let definition = {
        type: "array",
        items: {
          type: "string",
          anyOf: [
            {
              type: "string"
            },
            {
              type: "integer"
            }
          ]
        }
      }

      let expected = [ "string", 0 ]

      expect(sampleFromSchema(definition)).toEqual(expected)
    })

    it("returns array of samples for anyOf examples", () => {
      let definition = {
        type: "array",
        items: {
          type: "string",
          anyOf: [
            {
              type: "string",
              example: "dog"
            },
            {
              type: "integer",
              example: 1
            }
          ]
        }
      }

      let expected = [ "dog", 1 ]

      expect(sampleFromSchema(definition)).toEqual(expected)
    })

    it("returns null for a null example", () => {
      let definition = {
        "type": "object",
        "properties": {
          "foo": {
            "type": "string",
            "nullable": true,
            "example": null
          }
        }
      }

      let expected = {
        foo: null
      }

      expect(sampleFromSchema(definition)).toEqual(expected)
    })

    it("returns null for a null object-level example", () => {
      let definition = {
        "type": "object",
        "properties": {
          "foo": {
            "type": "string",
            "nullable": true
          }
        },
        "example": {
          "foo": null
        }
      }

      let expected = {
        foo: null
      }

      expect(sampleFromSchema(definition)).toEqual(expected)
    })
  })

  it("should use overrideExample when defined", () => {
    const definition = {
      type: "object",
      properties: {
        foo: {
          type: "string"
        }
      },
      example: {
        foo: null
      }
    }

    const expected = {
      foo: "override"
    }

    expect(sampleFromSchema(definition, {}, expected)).toEqual(expected)
  })

  it("should merge properties with anyOf", () => {
    const definition = {
      type: "object",
      properties: {
        foo: {
          type: "string"
        }
      },
      anyOf: [
        {
          type: "object",
          properties: {
            bar: {
              type: "boolean"
            }
          }
        }
      ]
    }

    const expected = {
      foo: "string",
      bar: true
    }

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should merge array item properties with anyOf", () => {
    const definition = {
      type: "array",
      items: {
        type: "object",
        properties: {
          foo: {
            type: "string"
          }
        },
        anyOf: [
          {
            type: "object",
            properties: {
              bar: {
                type: "boolean"
              }
            }
          }
        ]
      }
    }

    const expected = [
      {
        foo: "string",
        bar: true
      }
    ]

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should merge properties with oneOf", () => {
    const definition = {
      type: "object",
      properties: {
        foo: {
          type: "string"
        }
      },
      oneOf: [
        {
          type: "object",
          properties: {
            bar: {
              type: "boolean"
            }
          }
        }
      ]
    }

    const expected = {
      foo: "string",
      bar: true
    }

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should merge array item properties with oneOf", () => {
    const definition = {
      type: "array",
      items: {
        type: "object",
        properties: {
          foo: {
            type: "string"
          }
        },
        oneOf: [
          {
            type: "object",
            properties: {
              bar: {
                type: "boolean"
              }
            }
          }
        ]
      }
    }

    const expected = [
      {
        foo: "string",
        bar: true
      }
    ]

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should lift items with anyOf", () => {
    const definition = {
      type: "array",
      anyOf: [
        {
          type: "array",
          items: {
            type: "boolean"
          }
        }
      ]
    }

    const expected = [
      true
    ]


    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should lift items with oneOf", () => {
    const definition = {
      type: "array",
      oneOf: [
        {
          type: "array",
          items: {
            type: "boolean"
          }
        }
      ]
    }

    const expected = [
      true
    ]

    expect(sampleFromSchema(definition)).toEqual(expected)
  })
  it("should ignore minProperties if cannot extend object", () => {
    const definition = {
      type: "object",
      minProperties: 2,
      properties: {
        foo: {
          type: "string"
        }
      }
    }

    const expected = {
      foo: "string"
    }

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should handle minProperties in conjunction with additionalProperties", () => {
    const definition = {
      type: "object",
      minProperties: 2,
      additionalProperties: true,
      properties: {
        foo: {
          type: "string"
        }
      }
    }

    const expected = {
      foo: "string",
      additionalProp1: {}
    }

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should handle minProperties in conjunction with additionalProperties and anyOf", () => {
    const definition = {
      type: "object",
      minProperties: 2,
      additionalProperties: true,
      anyOf: [
        {
          type: "object",
          properties: {
            foo: {
              type: "string"
            }
          }
        }
      ]
    }

    const expected = {
      foo: "string",
      additionalProp1: {}
    }

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should handle maxProperties", () => {
    const definition = {
      type: "object",
      maxProperties: 1,
      properties: {
        foo: {
          type: "string"
        },
        swaggerUi: {
          type: "string"
        }
      }
    }

    const expected = {
      foo: "string"
    }

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should handle maxProperties in conjunction with anyOf", () => {
    const definition = {
      type: "object",
      maxProperties: 1,
      anyOf: [
        {
          type: "object",
          properties: {
            foo: {
              type: "string"
            },
            swaggerUi: {
              type: "string"
            }
          }
        }
      ]
    }

    const expected = {
      foo: "string"
    }

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should handle handle maxProperties in conjunction with required", () => {
    const definition = {
      type: "object",
      maxProperties: 1,
      required: ["swaggerUi"],
      properties: {
        foo: {
          type: "string"
        },
        swaggerUi: {
          type: "string",
          example: "<3"
        }
      }
    }

    const expected = {
      swaggerUi: "<3",
    }

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should handle handle maxProperties in conjunction with anyOf required", () => {
    const definition = {
      type: "object",
      maxProperties: 1,
      required: ["swaggerUi"],
      anyOf: [
        {
          type: "object",
          properties: {
            foo: {
              type: "string"
            },
            swaggerUi: {
              type: "string",
              example: "<3"
            }
          }
        }
      ],
    }

    const expected = {
      swaggerUi: "<3",
    }

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should handle minItems", () => {
    const definition = {
      type: "array",
      minItems: 2,
      items: {
        type: "string"
      }
    }

    const expected = ["string", "string"]

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should handle minItems with example", () => {
    const definition = {
      type: "array",
      minItems: 2,
      items: {
        type: "string",
        example: "some"
      },
    }

    const expected = ["some", "some"]

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should handle minItems in conjunction with oneOf", () => {
    const definition = {
      type: "array",
      minItems: 4,
      items: {
        oneOf: [
          {
            type: "string"
          },
          {
            type: "number"
          }
        ]
      }
    }

    const expected = ["string", 0, "string", 0]

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should handle maxItems in conjunction with multiple oneOf", () => {
    const definition = {
      type: "array",
      maxItems: 1,
      items: {
        oneOf: [
          {
            type: "string"
          },
          {
            type: "number"
          }
        ]
      }
    }

    const expected = ["string"]

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should handle minimum", () => {
    const definition = {
      type: "number",
      minimum: 5,
    }

    const expected = 5

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should handle minimum with exclusive", () => {
    const definition = {
      type: "number",
      minimum: 5,
      exclusiveMinimum: true,
    }

    const expected = 6

    expect(sampleFromSchema(definition)).toEqual(expected)
  })


  it("should handle maximum", () => {
    const definition = {
      type: "number",
      maximum: -1,
    }

    const expected = -1

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should handle maximum with exclusive", () => {
    const definition = {
      type: "number",
      maximum: -1,
      exclusiveMaximum: true,
    }

    const expected = -2

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should handle minLength", () => {
    const definition = {
      type: "string",
      minLength: 7
    }

    const expected = "strings"

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should handle maxLength", () => {
    const definition = {
      type: "string",
      maxLength: 3
    }

    const expected = "str"

    expect(sampleFromSchema(definition)).toEqual(expected)
  })
})

describe("createXMLExample", function () {
  let sut = createXMLExample
  describe("simple types with xml property", function () {
    it("returns tag <newtagname>string</newtagname> when passing type string and xml:{name: \"newtagname\"}", function () {
      let definition = {
        type: "string",
        xml: {
          name: "newtagname"
        }
      }

      expect(sut(definition)).toEqual("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<newtagname>string</newtagname>")
    })

    it("returns tag <test:newtagname>string</test:newtagname> when passing type string and xml:{name: \"newtagname\", prefix:\"test\"}", function () {
      let definition = {
        type: "string",
        xml: {
          name: "newtagname",
          prefix: "test"
        }
      }

      expect(sut(definition)).toEqual("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<test:newtagname>string</test:newtagname>")
    })

    it("returns tag <test:tagname xmlns:sample=\"http://swagger.io/schema/sample\">string</test:tagname> when passing type string and xml:{\"namespace\": \"http://swagger.io/schema/sample\", \"prefix\": \"sample\"}", function () {
      let definition = {
        type: "string",
        xml: {
          namespace: "http://swagger.io/schema/sample",
          prefix: "sample",
          name: "name"
        }
      }

      expect(sut(definition)).toEqual("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<sample:name xmlns:sample=\"http://swagger.io/schema/sample\">string</sample:name>")
    })

    it("returns tag <test:tagname >string</test:tagname> when passing type string and xml:{\"namespace\": \"http://swagger.io/schema/sample\"}", function () {
      let definition = {
        type: "string",
        xml: {
          namespace: "http://swagger.io/schema/sample",
          name: "name"
        }
      }

      expect(sut(definition)).toEqual("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<name xmlns=\"http://swagger.io/schema/sample\">string</name>")
    })

    it("returns tag <newtagname>test</newtagname> when passing default value", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<newtagname>test</newtagname>"
      let definition = {
        type: "string",
        "default": "test",
        xml: {
          name: "newtagname"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns default value when enum provided", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<newtagname>one</newtagname>"
      let definition = {
        type: "string",
        "default": "one",
        "enum": ["two", "one"],
        xml: {
          name: "newtagname"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns example value when provided", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<newtagname>two</newtagname>"
      let definition = {
        type: "string",
        "default": "one",
        "example": "two",
        "enum": ["two", "one"],
        xml: {
          name: "newtagname"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("sets first enum if provided", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<newtagname>one</newtagname>"
      let definition = {
        type: "string",
        "enum": ["one", "two"],
        xml: {
          name: "newtagname"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })
  })

  describe("array", function () {
    it("returns tag <tagname>string</tagname> when passing string items", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<tagname>string</tagname>"
      let definition = {
        type: "array",
        items: {
          type: "string"
        },
        xml: {
          name: "tagname"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns tag <animal>string</animal> when passing string items with name", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animal>string</animal>"
      let definition = {
        type: "array",
        items: {
          type: "string",
          xml: {
            name: "animal"
          }
        },
        xml: {
          name: "animals"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns tag <animals><animal>string</animal></animals> when passing string items with name", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animals>\n\t<animal>string</animal>\n</animals>"
      let definition = {
        type: "array",
        items: {
          type: "string",
          xml: {
            name: "animal"
          }
        },
        xml: {
          wrapped: true,
          name: "animals"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("return correct nested wrapped array", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<aliens>\n\t<dog>string</dog>\n</aliens>"
      let definition = {
        type: "array",
        items: {
          type: "array",
          items: {
            type: "string"
          },
          xml: {
            name: "dog"
          }
        },
        xml: {
          wrapped: true,
          name: "aliens"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("return correct nested wrapped array with xml", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<aliens>\n\t<dogs>\n\t\t<dog>string</dog>\n\t</dogs>\n</aliens>"
      let definition = {
        type: "array",
        items: {
          type: "array",
          items: {
            type: "string",
            xml: {
              name: "dog"
            }
          },
          xml: {
            name: "dogs",
            wrapped: true
          }
        },
        xml: {
          wrapped: true,
          name: "aliens"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("adds namespace to array", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<dog xmlns=\"test\">string</dog>"
      let definition = {
        type: "array",
        items: {
          type: "string",
          xml: {
            name: "dog",
            namespace: "test"
          }
        },
        xml: {
          name: "aliens",
          namespace: "test_new"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("adds prefix to array", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<test:dog>string</test:dog>"
      let definition = {
        type: "array",
        items: {
          type: "string",
          xml: {
            name: "dog",
            prefix: "test"
          }
        },
        xml: {
          name: "aliens",
          prefix: "test_new"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("adds prefix to array with no xml in items", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<test:dog>string</test:dog>"
      let definition = {
        type: "array",
        items: {
          type: "string"
        },
        xml: {
          name: "dog",
          prefix: "test"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("adds namespace to array with no xml in items", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<dog xmlns=\"test\">string</dog>"
      let definition = {
        type: "array",
        items: {
          type: "string"
        },
        xml: {
          name: "dog",
          namespace: "test"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("adds namespace to array with wrapped", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<aliens xmlns=\"test\">\n\t<dog>string</dog>\n</aliens>"
      let definition = {
        type: "array",
        items: {
          type: "string",
          xml: {
            name: "dog"
          }
        },
        xml: {
          wrapped: true,
          name: "aliens",
          namespace: "test"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("adds prefix to array with wrapped", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<test:aliens>\n\t<dog>string</dog>\n</test:aliens>"
      let definition = {
        type: "array",
        items: {
          type: "string",
          xml: {
            name: "dog"
          }
        },
        xml: {
          wrapped: true,
          name: "aliens",
          prefix: "test"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns wrapped array when type is not passed", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animals>\n\t<animal>string</animal>\n</animals>"
      let definition = {
        items: {
          type: "string",
          xml: {
            name: "animal"
          }
        },
        xml: {
          wrapped: true,
          name: "animals"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns array with default values", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animal>one</animal>\n<animal>two</animal>"
      let definition = {
        items: {
          type: "string",
          xml: {
            name: "animal"
          }
        },
        "default": ["one", "two"],
        xml: {
          name: "animals"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns array with default values with wrapped=true", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animals>\n\t<animal>one</animal>\n\t<animal>two</animal>\n</animals>"
      let definition = {
        items: {
          type: "string",
          xml: {
            name: "animal"
          }
        },
        "default": ["one", "two"],
        xml: {
          wrapped: true,
          name: "animals"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns array with default values", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animal>one</animal>"
      let definition = {
        items: {
          type: "string",
          "enum": ["one", "two"],
          xml: {
            name: "animal"
          }
        },
        xml: {
          name: "animals"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns array with default values with wrapped=true", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animals>\n\t<animal>1</animal>\n\t<animal>2</animal>\n</animals>"
      let definition = {
        items: {
          "enum": ["one", "two"],
          type: "string",
          xml: {
            name: "animal"
          }
        },
        "default": ["1", "2"],
        xml: {
          wrapped: true,
          name: "animals"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns array with example values  with ", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animals>\n\t<animal>1</animal>\n\t<animal>2</animal>\n</animals>"
      let definition = {
        type: "object",
        properties: {
          "animal": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "example": [
              "1",
              "2"
            ]
          }
        },
        xml: {
          name: "animals"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns array with example values  with wrapped=true", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animals>\n\t<animal>1</animal>\n\t<animal>2</animal>\n</animals>"
      let definition = {
        type: "array",
        items: {
          type: "string",
          xml: {
            name: "animal"
          }
        },
        "example": [ "1", "2" ],
        xml: {
          wrapped: true,
          name: "animals"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns array of objects with example values  with wrapped=true", function () {
      let expected = `<?xml version="1.0" encoding="UTF-8"?>\n<users>\n\t<user>\n\t\t<id>1</id>\n\t\t<name>Arthur Dent</name>\n\t</user>\n\t<user>\n\t\t<id>2</id>\n\t\t<name>Ford Prefect</name>\n\t</user>\n</users>`
      let definition = {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer"
            },
            "name": {
              "type": "string"
            }
          },
          "xml": {
            "name": "user"
          }
        },
        "xml": {
          "name": "users",
          "wrapped": true
        },
        "example": [
          {
            "id": 1,
            "name": "Arthur Dent"
          },
          {
            "id": 2,
            "name": "Ford Prefect"
          }
        ]
      }

      expect(sut(definition)).toEqual(expected)
    })
    it("should return additionalProperty example", () => {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<aliens>\n\t<notalien>test</notalien>\n</aliens>"
      let definition = {
        type: "array",
        items: {
          type: "object",
          properties: {
            alien: {
              type: "string"
            },
            dog: {
              type: "integer"
            }
          }
        },
        xml: {
          name: "aliens"
        }
      }

      expect(sut(definition, {}, [{ notalien: "test" }])).toEqual(expected)
    })
    it("should return literal example", () => {
      let expected = "<notaliens>\n\t\n\t<dog>0</dog>\n</notaliens>"
      let definition = {
        type: "array",
        items: {
          properties: {
            alien: {
              type: "string"
            },
            dog: {
              type: "integer"
            }
          }
        },
        xml: {
          name: "aliens"
        }
      }

      expect(sut(definition, {}, expected)).toEqual(expected)
    })
})

  describe("object", function () {
    it("returns object with 2 properties", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<aliens>\n\t<alien>string</alien>\n\t<dog>0</dog>\n</aliens>"
      let definition = {
        type: "object",
        properties: {
          alien: {
            type: "string"
          },
          dog: {
            type: "integer"
          }
        },
        xml: {
          name: "aliens"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns object with integer property and array property", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animals>\n\t<aliens>string</aliens>\n\t<dog>0</dog>\n</animals>"
      let definition = {
        type: "object",
        properties: {
          aliens: {
            type: "array",
            items: {
              type: "string"
            }
          },
          dog: {
            type: "integer"
          }
        },
        xml: {
          name: "animals"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns nested objects", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animals>\n\t<aliens>\n\t\t<alien>string</alien>\n\t</aliens>\n\t<dog>string</dog>\n</animals>"
      let definition = {
        type: "object",
        properties: {
          aliens: {
            type: "object",
            properties: {
              alien: {
                type: "string",
                xml: {
                  name: "alien"
                }
              }
            }
          },
          dog: {
            type: "string"
          }
        },
        xml: {
          name: "animals"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns object with no readonly fields for parameter", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animals>\n\t<id>0</id>\n</animals>"
      let definition = {
        type: "object",
        properties: {
          id: {
            type: "integer"
          },
          dog: {
            readOnly: true,
            type: "string"
          }
        },
        xml: {
          name: "animals"
        }
      }

      expect(sut(definition, { includeReadOnly: false })).toEqual(expected)
    })

    it("returns object with readonly fields for parameter, with includeReadOnly", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animals>\n\t<id>0</id>\n\t<dog>string</dog>\n</animals>"
      let definition = {
        type: "object",
        properties: {
          id: {
            type: "integer"
          },
          dog: {
            readOnly: true,
            type: "string"
          }
        },
        xml: {
          name: "animals"
        }
      }

      expect(sut(definition, { includeReadOnly: true })).toEqual(expected)
    })

    it("returns object without writeonly fields for parameter", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animals>\n\t<id>0</id>\n</animals>"
      let definition = {
        type: "object",
        properties: {
          id: {
            type: "integer"
          },
          dog: {
            writeOnly: true,
            type: "string"
          }
        },
        xml: {
          name: "animals"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns object with writeonly fields for parameter, with includeWriteOnly", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animals>\n\t<id>0</id>\n\t<dog>string</dog>\n</animals>"
      let definition = {
        type: "object",
        properties: {
          id: {
            type: "integer"
          },
          dog: {
            writeOnly: true,
            type: "string"
          }
        },
        xml: {
          name: "animals"
        }
      }

      expect(sut(definition, { includeWriteOnly: true })).toEqual(expected)
    })

    it("returns object with passed property as attribute", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animals id=\"0\">\n\t<dog>string</dog>\n</animals>"
      let definition = {
        type: "object",
        properties: {
          id: {
            type: "integer",
            xml: {
              attribute: true
            }
          },
          dog: {
            type: "string"
          }
        },
        xml: {
          name: "animals"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns object with passed property as attribute with custom name", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animals test=\"0\">\n\t<dog>string</dog>\n</animals>"
      let definition = {
        type: "object",
        properties: {
          id: {
            type: "integer",
            xml: {
              attribute: true,
              name: "test"
            }
          },
          dog: {
            type: "string"
          }
        },
        xml: {
          name: "animals"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns object with example values in attribute", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<user id=\"42\">\n\t<role>admin</role>\n</user>"
      let definition = {
        type: "object",
        properties: {
          id: {
            type: "integer",
            xml: {
              attribute: true
            }
          },
          role:{
            type: "string"
          }
        },
        xml: {
          name: "user"
        },
        example: {
          id: 42,
          role: "admin"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns object with enum values in attribute", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<user id=\"one\">\n\t<role>string</role>\n</user>"
      let definition = {
        type: "object",
        properties: {
          id: {
            type: "string",
            "enum": ["one", "two"],
            xml: {
              attribute: true
            }
          },
          role:{
            type: "string"
          }
        },
        xml: {
          name: "user"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns object with default values in attribute", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<user id=\"one\">\n\t<role>string</role>\n</user>"
      let definition = {
        type: "object",
        properties: {
          id: {
            type: "string",
            "default": "one",
            xml: {
              attribute: true
            }
          },
          role:{
            type: "string"
          }
        },
        xml: {
          name: "user"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns object with default values in attribute", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<user id=\"one\">\n\t<role>string</role>\n</user>"
      let definition = {
        type: "object",
        properties: {
          id: {
            type: "string",
            "example": "one",
            xml: {
              attribute: true
            }
          },
          role:{
            type: "string"
          }
        },
        xml: {
          name: "user"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns object with example value", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<user>\n\t<id>42</id>\n\t<role>admin</role>\n</user>"
      let definition = {
        type: "object",
        properties: {
          id: {
            type: "integer"
          },
          role:{
            type: "string"
          }
        },
        xml: {
          name: "user"
        },
        example: {
          id: 42,
          role: "admin"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns object with additional props", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animals>\n\t<dog>string</dog>\n\t<additionalProp1>string</additionalProp1>\n\t<additionalProp2>string</additionalProp2>\n\t<additionalProp3>string</additionalProp3>\n</animals>"
      let definition = {
        type: "object",
        properties: {
          dog: {
            type: "string"
          }
        },
        additionalProperties: {
          type: "string"
        },
        xml: {
          name: "animals"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns object with additional props =true", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animals>\n\t<dog>string</dog>\n\t<additionalProp>Anything can be here</additionalProp>\n</animals>"
      let definition = {
        type: "object",
        properties: {
          dog: {
            type: "string"
          }
        },
        additionalProperties: true,
        xml: {
          name: "animals"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns object with 2 properties with no type passed but properties", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<aliens>\n\t<alien>string</alien>\n\t<dog>0</dog>\n</aliens>"
      let definition = {
        properties: {
          alien: {
            type: "string"
          },
          dog: {
            type: "integer"
          }
        },
        xml: {
          name: "aliens"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns object with additional props with no type passed", function () {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animals>\n\t<additionalProp1>string</additionalProp1>\n\t<additionalProp2>string</additionalProp2>\n\t<additionalProp3>string</additionalProp3>\n</animals>"
      let definition = {
        additionalProperties: {
          type: "string"
        },
        xml: {
          name: "animals"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })


    it("should use overrideExample when defined", () => {
      const expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<bar>\n\t<foo>override</foo>\n</bar>"

      const definition = {
        type: "object",
        properties: {
          foo: {
            type: "string",
            xml: {
              name: "foo"
            }
          }
        },
        example: {
          foo: null
        },
        xml: {
          name: "bar"
        }
      }

      const overrideExample = {
        foo: "override"
      }

      expect(sut(definition, {}, overrideExample)).toEqual(expected)
    })

    it("should return additionalProperty example", () => {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<aliens>\n\t<alien>test</alien>\n\t<dog>1</dog>\n</aliens>"
      let definition = {
        type: "object",
        properties: {
          alien: {
            type: "string"
          },
          dog: {
            type: "integer"
          }
        },
        xml: {
          name: "aliens"
        }
      }

      expect(sut(definition, {}, { alien: "test", dog: 1 })).toEqual(expected)
    })
    it("should return literal example", () => {
      let expected = "<notaliens>\n\t\n\t<dog>0</dog>\n</notaliens>"
      let definition = {
        type: "object",
        properties: {
          alien: {
            type: "string"
          },
          dog: {
            type: "integer"
          }
        },
        xml: {
          name: "aliens"
        }
      }

      expect(sut(definition, {}, expected)).toEqual(expected)
    })
    it("should use exampleOverride for attr too", () => {
      let expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<aliens test=\"probe\">\n</aliens>"
      let definition = {
        type: "object",
        properties: {
          test: {
            type: "string",
            xml: {
              attribute: true
            }
          }
        },
        xml: {
          name: "aliens"
        }
      }

      expect(sut(definition, {}, { test: "probe" })).toEqual(expected)
    })
  })

  it("should handle handle maxProperties in conjunction with required", function () {
    const definition = {
      type: "object",
      maxProperties: 1,
      required: ["swaggerUi"],
      xml: {
        name: "probe"
      },
      properties: {
        foo: {
          type: "string"
        },
        swaggerUi: {
          type: "string",
          example: "cool"
        }
      }
    }

    const expected = `<?xml version="1.0" encoding="UTF-8"?>
<probe>
\t<swaggerUi>cool</swaggerUi>
</probe>`

    expect(sut(definition)).toEqual(expected)
  })
})

describe("memoizedSampleFromSchema", () => {
  it("should sequentially update memoized overrideExample", () => {
    const definition = {
      type: "object",
      properties: {
        foo: {
          type: "string"
        }
      },
      example: {
        foo: null
      }
    }

    const expected = {
      foo: "override"
    }
    expect(memoizedSampleFromSchema(definition, {}, expected)).toEqual(expected)

    const updatedExpected = {
      foo: "cat"
    }
    expect(memoizedSampleFromSchema(definition, {}, updatedExpected)).toEqual(updatedExpected)
  })
})

describe("memoizedCreateXMLExample", () => {
  it("should sequentially update memoized overrideExample", () => {
    const expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<bar>\n\t<foo>override</foo>\n</bar>"

    const definition = {
      type: "object",
      properties: {
        foo: {
          type: "string",
          xml: {
            name: "foo"
          }
        }
      },
      example: {
        foo: null
      },
      xml: {
        name: "bar"
      }
    }

    const overrideExample = {
      foo: "override"
    }
    expect(memoizedCreateXMLExample(definition, {}, overrideExample)).toEqual(expected)

    const updatedOverrideExample = {
      foo: "cat"
    }
    const updatedExpected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<bar>\n\t<foo>cat</foo>\n</bar>"
    expect(memoizedCreateXMLExample(definition, {}, updatedOverrideExample)).toEqual(updatedExpected)
  })
})
