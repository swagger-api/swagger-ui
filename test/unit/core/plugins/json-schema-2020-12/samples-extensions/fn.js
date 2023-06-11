/**
 * @prettier
 *
 */
import { fromJS } from "immutable"
import {
  createXMLExample,
  sampleFromSchema,
  memoizedCreateXMLExample,
  memoizedSampleFromSchema,
} from "core/plugins/json-schema-2020-12/samples-extensions/fn"

describe("sampleFromSchema", () => {
  it("should return appropriate example for primitive types + format", function () {
    const sample = (schema) => sampleFromSchema(fromJS(schema))

    expect(sample({ type: "string" })).toStrictEqual("string")
    expect(sample({ type: "string", pattern: "^abc$" })).toStrictEqual("abc")
    expect(sample({ type: "string", format: "email" })).toStrictEqual(
      "user@example.com"
    )
    expect(sample({ type: "string", format: "idn-email" })).toStrictEqual(
      "실례@example.com"
    )
    expect(sample({ type: "string", format: "hostname" })).toStrictEqual(
      "example.com"
    )
    expect(sample({ type: "string", format: "idn-hostname" })).toStrictEqual(
      "실례.com"
    )
    expect(sample({ type: "string", format: "ipv4" })).toStrictEqual(
      "198.51.100.42"
    )
    expect(sample({ type: "string", format: "ipv6" })).toStrictEqual(
      "2001:0db8:5b96:0000:0000:426f:8e17:642a"
    )
    expect(sample({ type: "string", format: "uri" })).toStrictEqual(
      "https://example.com/"
    )
    expect(sample({ type: "string", format: "uri-reference" })).toStrictEqual(
      "path/index.html"
    )
    expect(sample({ type: "string", format: "iri" })).toStrictEqual(
      "https://실례.com/"
    )
    expect(sample({ type: "string", format: "iri-reference" })).toStrictEqual(
      "path/실례.html"
    )
    expect(sample({ type: "string", format: "uuid" })).toStrictEqual(
      "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    )
    expect(sample({ type: "string", format: "uri-template" })).toStrictEqual(
      "https://example.com/dictionary/{term:1}/{term}"
    )
    expect(sample({ type: "string", format: "json-pointer" })).toStrictEqual(
      "/a/b/c"
    )
    expect(
      sample({ type: "string", format: "relative-json-pointer" })
    ).toStrictEqual("1/0")
    expect(sample({ type: "string", format: "date-time" })).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z$/
    )
    expect(sample({ type: "string", format: "date" })).toMatch(
      /^\d{4}-\d{2}-\d{2}$/
    )
    expect(sample({ type: "string", format: "time" })).toMatch(
      /^\d{2}:\d{2}:\d{2}\.\d+Z$/
    )
    expect(sample({ type: "string", format: "duration" })).toStrictEqual("P3D")
    expect(sample({ type: "string", format: "password" })).toStrictEqual(
      "********"
    )
    expect(sample({ type: "string", format: "regex" })).toStrictEqual(
      "^[a-z]+$"
    )
    expect(sample({ type: "number" })).toStrictEqual(0)
    expect(sample({ type: "number", format: "float" })).toStrictEqual(0.1)
    expect(sample({ type: "number", format: "double" })).toStrictEqual(0.1)
    expect(sample({ type: "integer" })).toStrictEqual(0)
    expect(sample({ type: "integer", format: "int32" })).toStrictEqual(
      (2 ** 30) >>> 0
    )
    expect(sample({ type: "integer", format: "int64" })).toStrictEqual(
      2 ** 53 - 1
    )
    expect(sample({ type: "boolean" })).toStrictEqual(true)
    expect(sample({ type: "null" })).toStrictEqual(null)
  })

  it("should return appropriate example given contentEncoding", function () {
    const sample = (schema) => sampleFromSchema(fromJS(schema))

    expect(sample({ type: "string", contentEncoding: "7bit" })).toStrictEqual(
      "string"
    )
    expect(
      sample({
        type: "string",
        format: "idn-email",
        contentEncoding: "8bit",
      })
    ).toStrictEqual("실례@example.com")
    expect(
      sample({
        type: "string",
        format: "idn-hostname",
        contentEncoding: "binary",
      })
    ).toStrictEqual("ì\x8B¤ë¡\x80.com")
    expect(
      sample({
        type: "string",
        format: "iri-reference",
        contentEncoding: "quoted-printable",
      })
    ).toStrictEqual("path/=EC=8B=A4=EB=A1=80.html")
    expect(
      sample({
        type: "string",
        format: "ipv4",
        contentEncoding: "base16",
      })
    ).toStrictEqual("3139382e35312e3130302e3432")
    expect(
      sample({
        type: "string",
        format: "iri",
        contentEncoding: "base32",
      })
    ).toStrictEqual("NB2HI4DTHIXS7ZCAFZRW63JP")
    expect(
      sample({
        type: "string",
        format: "uri-template",
        contentEncoding: "base64",
      })
    ).toStrictEqual(
      "aHR0cHM6Ly9leGFtcGxlLmNvbS9kaWN0aW9uYXJ5L3t0ZXJtOjF9L3t0ZXJtfQ=="
    )
    expect(
      sample({
        type: "string",
        format: "iri-reference",
        contentEncoding: "custom-encoding",
      })
    ).toStrictEqual("path/실례.html") // act as an identity function when unknown encoding
  })

  it("should return appropriate example given contentMediaType", function () {
    const sample = (schema) => sampleFromSchema(fromJS(schema))

    expect(
      sample({ type: "string", contentMediaType: "text/plain" })
    ).toStrictEqual("string")
    expect(
      sample({
        type: "string",
        contentMediaType: "text/css",
      })
    ).toStrictEqual(".selector { border: 1px solid red }")
    expect(
      sample({
        type: "string",
        contentMediaType: "text/csv",
      })
    ).toStrictEqual("value1,value2,value3")
    expect(
      sample({
        type: "string",
        contentMediaType: "text/html",
      })
    ).toStrictEqual("<p>content</p>")
    expect(
      sample({
        type: "string",
        contentMediaType: "text/calendar",
      })
    ).toStrictEqual("BEGIN:VCALENDAR")
    expect(
      sample({
        type: "string",
        contentMediaType: "text/javascript",
      })
    ).toStrictEqual("console.dir('Hello world!');")
    expect(
      sample({
        type: "string",
        contentMediaType: "text/xml",
      })
    ).toStrictEqual('<person age="30">John Doe</person>')
    expect(
      sample({
        type: "string",
        contentMediaType: "text/cql", // unknown mime type
      })
    ).toStrictEqual("string")
    expect(
      sample({
        type: "string",
        contentMediaType: "image/png",
      })
    ).toHaveLength(25)
    expect(
      sample({
        type: "string",
        contentMediaType: "audio/mp4",
      })
    ).toHaveLength(25)
    expect(
      sample({
        type: "string",
        contentMediaType: "video/3gpp",
      })
    ).toHaveLength(25)
    expect(
      sample({
        type: "string",
        contentMediaType: "application/json",
      })
    ).toStrictEqual('{"key":"value"}')
    expect(
      sample({
        type: "string",
        contentMediaType: "application/ld+json",
      })
    ).toStrictEqual('{"name": "John Doe"}')
    expect(
      sample({
        type: "string",
        contentMediaType: "application/x-httpd-php",
      })
    ).toStrictEqual("<?php echo '<p>Hello World!</p>'; ?>")
    expect(
      sample({
        type: "string",
        contentMediaType: "application/rtf",
      })
    ).toStrictEqual(String.raw`{\rtf1\adeflang1025\ansi\ansicpg1252\uc1`)
    expect(
      sample({
        type: "string",
        contentMediaType: "application/x-sh",
      })
    ).toStrictEqual('echo "Hello World!"')
    expect(
      sample({
        type: "string",
        contentMediaType: "application/xhtml+xml",
      })
    ).toStrictEqual("<p>content</p>")
    expect(
      sample({
        type: "string",
        contentMediaType: "application/unknown",
      })
    ).toHaveLength(25)
  })

  it("should strip parameters from contentMediaType and recognizes it", function () {
    const definition = fromJS({
      type: "string",
      contentMediaType: "text/css",
    })

    expect(sampleFromSchema(definition)).toStrictEqual(
      ".selector { border: 1px solid red }"
    )
  })

  it("should handle combination of format + contentMediaType", function () {
    const definition = fromJS({
      type: "string",
      format: "hostname",
      contentMediaType: "text/css",
    })

    expect(sampleFromSchema(definition)).toStrictEqual("example.com")
  })

  it("should handle combination of contentEncoding + contentMediaType", function () {
    const definition = fromJS({
      type: "string",
      contentEncoding: "base64",
      contentMediaType: "image/png",
    })
    const base64Regex =
      /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/

    expect(sampleFromSchema(definition)).toMatch(base64Regex)
  })

  it("should handle contentSchema defined as type=object", function () {
    const definition = fromJS({
      type: "string",
      contentMediaType: "application/json",
      contentSchema: {
        type: "object",
        properties: {
          a: { const: "b" },
        },
      },
    })

    expect(sampleFromSchema(definition)).toStrictEqual('{"a":"b"}')
  })

  it("should handle contentSchema defined as type=string", function () {
    const definition = fromJS({
      type: "string",
      contentMediaType: "text/plain",
      contentSchema: {
        type: "string",
      },
    })

    expect(sampleFromSchema(definition)).toStrictEqual("string")
  })

  it("should handle contentSchema defined as type=number", function () {
    const definition = fromJS({
      type: "string",
      contentMediaType: "text/plain",
      contentSchema: {
        type: "number",
      },
    })

    expect(sampleFromSchema(definition)).toStrictEqual("0")
  })

  it("should handle contentSchema defined as type=number + contentEncoding", function () {
    const definition = fromJS({
      type: "string",
      contentEncoding: "base16",
      contentMediaType: "text/plain",
      contentSchema: {
        type: "number",
      },
    })

    expect(sampleFromSchema(definition)).toStrictEqual("30")
  })

  it("should handle type keyword defined as list of types", function () {
    const definition = fromJS({ type: ["object", "string"] })
    const expected = {}

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should prioritize array when array and object defined as list of types", function () {
    const definition = fromJS({ type: ["object", "array"] })
    const expected = []

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should handle primitive types defined as list of types", function () {
    const definition = fromJS({ type: ["string", "number"] })
    const expected = "string"

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should return const value", function () {
    const definition = fromJS({ const: 3 })
    const expected = 3

    expect(sampleFromSchema(definition)).toStrictEqual(expected)
  })

  it("handles Immutable.js objects for nested schemas", function () {
    const definition = fromJS({
      type: "object",
      properties: {
        json: {
          type: "object",
          example: {
            a: "string",
          },
          properties: {
            a: {
              type: "string",
            },
          },
        },
      },
    })

    const expected = {
      json: {
        a: "string",
      },
    }

    expect(sampleFromSchema(definition, { includeReadOnly: false })).toEqual(
      expected
    )
  })

  it("should return first enum value if only enum is provided", function () {
    const definition = fromJS({
      enum: ["probe"],
    })

    const expected = "probe"
    expect(sampleFromSchema(definition, { includeReadOnly: false })).toEqual(
      expected
    )
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
              example: "anyOf",
            },
            test: {
              type: "string",
              example: "anyOf",
            },
          },
        },
      ],
      properties: {
        test: {
          type: "string",
          example: "schema",
        },
      },
    }

    let expected = {
      test: "schema",
      test2: "anyOf",
    }

    expect(sampleFromSchema(definition, { includeReadOnly: false })).toEqual(
      expected
    )

    definition = {
      type: "object",
      oneOf: [
        {
          type: "object",
          properties: {
            test2: {
              type: "string",
              example: "oneOf",
            },
            test: {
              type: "string",
              example: "oneOf",
            },
          },
        },
      ],
      properties: {
        test: {
          type: "string",
          example: "schema",
        },
      },
    }

    expected = {
      test: "schema",
      test2: "oneOf",
    }

    expect(sampleFromSchema(definition, { includeReadOnly: false })).toEqual(
      expected
    )
  })

  it("returns object with no readonly fields for parameter", function () {
    const definition = {
      type: "object",
      properties: {
        id: {
          type: "integer",
        },
        readOnlyDog: {
          readOnly: true,
          type: "string",
        },
      },
      xml: {
        name: "animals",
      },
    }

    const expected = {
      id: 0,
    }

    expect(sampleFromSchema(definition, { includeReadOnly: false })).toEqual(
      expected
    )
  })

  it("returns object with readonly fields for parameter, with includeReadOnly", function () {
    const definition = {
      type: "object",
      properties: {
        id: {
          type: "integer",
        },
        readOnlyDog: {
          readOnly: true,
          type: "string",
        },
      },
      xml: {
        name: "animals",
      },
    }

    const expected = {
      id: 0,
      readOnlyDog: "string",
    }

    expect(sampleFromSchema(definition, { includeReadOnly: true })).toEqual(
      expected
    )
  })

  it("regex pattern test", function () {
    const definition = {
      type: "object",
      properties: {
        macAddress: {
          type: "string",
          pattern: "^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$",
        },
      },
    }
    const resp = sampleFromSchema(definition)

    expect(
      new RegExp("^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$", "g").test(
        resp.macAddress
      )
    ).toBe(true)
  })

  it("returns object without deprecated fields for parameter", function () {
    const definition = {
      type: "object",
      properties: {
        id: {
          type: "integer",
        },
        deprecatedProperty: {
          deprecated: true,
          type: "string",
        },
      },
      xml: {
        name: "animals",
      },
    }

    const expected = {
      id: 0,
    }

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("returns object without writeonly fields for parameter", function () {
    const definition = {
      type: "object",
      properties: {
        id: {
          type: "integer",
        },
        writeOnlyDog: {
          writeOnly: true,
          type: "string",
        },
      },
      xml: {
        name: "animals",
      },
    }

    const expected = {
      id: 0,
    }

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("returns object with writeonly fields for parameter, with includeWriteOnly", function () {
    const definition = {
      type: "object",
      properties: {
        id: {
          type: "integer",
        },
        writeOnlyDog: {
          writeOnly: true,
          type: "string",
        },
      },
      xml: {
        name: "animals",
      },
    }

    const expected = {
      id: 0,
      writeOnlyDog: "string",
    }

    expect(sampleFromSchema(definition, { includeWriteOnly: true })).toEqual(
      expected
    )
  })

  it("returns example value for date-time property", () => {
    const definition = {
      type: "string",
      format: "date-time",
    }

    // 0-20 chops off milliseconds
    // necessary because test latency can cause failures
    // it would be better to mock Date globally and expect a string - KS 11/18
    const expected = new Date().toISOString().substring(0, 20)

    expect(sampleFromSchema(definition)).toContain(expected)
  })

  it("returns example value for date property", () => {
    const definition = {
      type: "string",
      format: "date",
    }

    const expected = new Date().toISOString().substring(0, 10)

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("returns a UUID for a string with format=uuid", () => {
    const definition = {
      type: "string",
      format: "uuid",
    }

    const expected = "3fa85f64-5717-4562-b3fc-2c963f66afa6"

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("returns a hostname for a string with format=hostname", () => {
    const definition = {
      type: "string",
      format: "hostname",
    }

    const expected = "example.com"

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("returns an IPv4 address for a string with format=ipv4", () => {
    const definition = {
      type: "string",
      format: "ipv4",
    }

    const expected = "198.51.100.42"

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("returns an IPv6 address for a string with format=ipv6", () => {
    const definition = {
      type: "string",
      format: "ipv6",
    }

    const expected = "2001:0db8:5b96:0000:0000:426f:8e17:642a"

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  describe("for array type", () => {
    it("returns array with sample of array type", () => {
      const definition = {
        type: "array",
        items: {
          type: "integer",
        },
      }

      const expected = [0]

      expect(sampleFromSchema(definition)).toEqual(expected)
    })

    it("returns string for example for array that has example of type string", () => {
      const definition = {
        type: "array",
        items: {
          type: "string",
        },
        example: "dog",
      }

      const expected = "dog"

      expect(sampleFromSchema(definition)).toEqual(expected)
    })

    it("returns array of examples for array that has examples", () => {
      const definition = {
        type: "array",
        items: {
          type: "string",
        },
        example: ["dog", "cat"],
      }

      const expected = ["dog", "cat"]

      expect(sampleFromSchema(definition)).toEqual(expected)
    })

    it("returns array of samples for oneOf type", () => {
      const definition = {
        type: "array",
        items: {
          type: "string",
          oneOf: [
            {
              type: "integer",
            },
          ],
        },
      }

      const expected = [0]

      expect(sampleFromSchema(definition)).toEqual(expected)
    })

    it("returns array of samples for oneOf types", () => {
      const definition = {
        type: "array",
        items: {
          type: "string",
          oneOf: [
            {
              type: "string",
            },
            {
              type: "integer",
            },
          ],
        },
      }

      const expected = ["string", 0]

      expect(sampleFromSchema(definition)).toEqual(expected)
    })

    it("returns array of samples for oneOf examples", () => {
      const definition = {
        type: "array",
        items: {
          type: "string",
          oneOf: [
            {
              type: "string",
              example: "dog",
            },
            {
              type: "integer",
              example: 1,
            },
          ],
        },
      }

      const expected = ["dog", 1]

      expect(sampleFromSchema(definition)).toEqual(expected)
    })

    it("returns array of samples for anyOf type", () => {
      const definition = {
        type: "array",
        items: {
          type: "string",
          anyOf: [
            {
              type: "integer",
            },
          ],
        },
      }

      const expected = [0]

      expect(sampleFromSchema(definition)).toEqual(expected)
    })

    it("returns array of samples for anyOf types", () => {
      const definition = {
        type: "array",
        items: {
          type: "string",
          anyOf: [
            {
              type: "string",
            },
            {
              type: "integer",
            },
          ],
        },
      }

      const expected = ["string", 0]

      expect(sampleFromSchema(definition)).toEqual(expected)
    })

    it("returns array of samples for anyOf examples", () => {
      const definition = {
        type: "array",
        items: {
          type: "string",
          anyOf: [
            {
              type: "string",
              example: "dog",
            },
            {
              type: "integer",
              example: 1,
            },
          ],
        },
      }

      const expected = ["dog", 1]

      expect(sampleFromSchema(definition)).toEqual(expected)
    })

    it("returns null for a null example", () => {
      const definition = {
        type: "object",
        properties: {
          foo: {
            type: "string",
            nullable: true,
            example: null,
          },
        },
      }

      const expected = {
        foo: null,
      }

      expect(sampleFromSchema(definition)).toEqual(expected)
    })

    it("returns null for a null object-level example", () => {
      const definition = {
        type: "object",
        properties: {
          foo: {
            type: "string",
            nullable: true,
          },
        },
        example: {
          foo: null,
        },
      }

      const expected = {
        foo: null,
      }

      expect(sampleFromSchema(definition)).toEqual(expected)
    })
  })

  describe("discriminator mapping example", () => {
    it("returns an example where discriminated field is equal to mapping value", () => {
      const definition = {
        type: "array",
        items: {
          oneOf: [
            {
              required: ["type"],
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: ["TYPE1", "TYPE2"],
                },
              },
              discriminator: {
                propertyName: "type",
                mapping: {
                  TYPE1: "#/components/schemas/FirstDto",
                  TYPE2: "#/components/schemas/SecondDto",
                },
              },
              $$ref:
                "examples/swagger-config.yaml#/components/schemas/FirstDto",
            },
            {
              required: ["type"],
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: ["TYPE1", "TYPE2"],
                },
              },
              discriminator: {
                propertyName: "type",
                mapping: {
                  TYPE1: "#/components/schemas/FirstDto",
                  TYPE2: "#/components/schemas/SecondDto",
                },
              },
              $$ref:
                "examples/swagger-config.yaml#/components/schemas/SecondDto",
            },
          ],
        },
      }

      const expected = [
        {
          type: "TYPE1",
        },
        {
          type: "TYPE2",
        },
      ]

      expect(sampleFromSchema(definition)).toEqual(expected)
    })

    it("should not throw if expected $$ref is missing, and should fallback to default behavior", () => {
      const definition = {
        type: "array",
        items: {
          oneOf: [
            {
              required: ["type"],
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: ["TYPE1", "TYPE2"],
                },
              },
              discriminator: {
                propertyName: "type",
                mapping: {
                  TYPE1: "#/components/schemas/FirstDto",
                  TYPE2: "#/components/schemas/SecondDto",
                },
              },
            },
            {
              required: ["type"],
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: ["TYPE1", "TYPE2"],
                },
              },
              discriminator: {
                propertyName: "type",
                mapping: {
                  TYPE1: "#/components/schemas/FirstDto",
                  TYPE2: "#/components/schemas/SecondDto",
                },
              },
            },
          ],
        },
      }

      expect(() => {
        sampleFromSchema(definition)
      }).not.toThrow()
    })
  })

  it("should use overrideExample when defined", () => {
    const definition = {
      type: "object",
      properties: {
        foo: {
          type: "string",
        },
      },
      example: {
        foo: null,
      },
    }

    const expected = {
      foo: "override",
    }

    expect(sampleFromSchema(definition, {}, expected)).toEqual(expected)
  })

  it("should merge properties with anyOf", () => {
    const definition = {
      type: "object",
      properties: {
        foo: {
          type: "string",
        },
      },
      anyOf: [
        {
          type: "object",
          properties: {
            bar: {
              type: "boolean",
            },
          },
        },
      ],
    }

    const expected = {
      foo: "string",
      bar: true,
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
            type: "string",
          },
        },
        anyOf: [
          {
            type: "object",
            properties: {
              bar: {
                type: "boolean",
              },
            },
          },
        ],
      },
    }

    const expected = [
      {
        foo: "string",
        bar: true,
      },
    ]

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should merge properties with oneOf", () => {
    const definition = {
      type: "object",
      properties: {
        foo: {
          type: "string",
        },
      },
      oneOf: [
        {
          type: "object",
          properties: {
            bar: {
              type: "boolean",
            },
          },
        },
      ],
    }

    const expected = {
      foo: "string",
      bar: true,
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
            type: "string",
          },
        },
        oneOf: [
          {
            type: "object",
            properties: {
              bar: {
                type: "boolean",
              },
            },
          },
        ],
      },
    }

    const expected = [
      {
        foo: "string",
        bar: true,
      },
    ]

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should merge items with anyOf", () => {
    const definition = {
      type: "array",
      anyOf: [
        {
          type: "array",
          items: {
            type: "boolean",
          },
        },
      ],
    }

    const expected = [true]

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should merge items with oneOf", () => {
    const definition = {
      type: "array",
      oneOf: [
        {
          type: "array",
          items: {
            type: "boolean",
          },
        },
      ],
    }

    const expected = [true]

    expect(sampleFromSchema(definition)).toEqual(expected)
  })
  it("should ignore minProperties if cannot extend object", () => {
    const definition = {
      type: "object",
      minProperties: 2,
      properties: {
        foo: {
          type: "string",
        },
      },
    }

    const expected = {
      foo: "string",
    }

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should handle minProperties in conjunction with additionalProperties", () => {
    const definition = {
      type: "object",
      minProperties: 2,
      additionalProperties: {
        type: "string",
      },
    }

    const expected = {
      additionalProp1: "string",
      additionalProp2: "string",
    }

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should handle minProperties in conjunction with properties and additionalProperties", () => {
    const definition = {
      type: "object",
      minProperties: 2,
      additionalProperties: true,
      properties: {
        foo: {
          type: "string",
        },
      },
    }

    const expected = {
      foo: "string",
      additionalProp1: {},
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
              type: "string",
            },
          },
        },
      ],
    }

    const expected = {
      foo: "string",
      additionalProp1: {},
    }

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should handle maxProperties", () => {
    const definition = {
      type: "object",
      maxProperties: 1,
      properties: {
        foo: {
          type: "string",
        },
        swaggerUi: {
          type: "string",
        },
      },
    }

    const expected = {
      foo: "string",
    }

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should handle maxProperties in conjunction with additionalProperties", () => {
    const definition = {
      type: "object",
      maxProperties: 1,
      additionalProperties: true,
    }

    const expected = {
      additionalProp1: {},
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
              type: "string",
            },
            swaggerUi: {
              type: "string",
            },
          },
        },
      ],
    }

    const expected = {
      foo: "string",
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
          type: "string",
        },
        swaggerUi: {
          type: "string",
          example: "<3",
        },
      },
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
              type: "string",
            },
            swaggerUi: {
              type: "string",
              example: "<3",
            },
          },
        },
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
        type: "string",
      },
    }

    const expected = ["string", "string"]

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should handle maxItems", () => {
    const definition = {
      type: "array",
      minItems: 4,
      maxItems: 7,
      items: {
        type: "string",
      },
    }

    const expected = sampleFromSchema(definition).length

    expect(expected).toBeGreaterThanOrEqual(4)
    expect(expected).toBeLessThanOrEqual(7)
  })

  it("should handle uniqueItems", () => {
    const definition = {
      type: "array",
      minItems: 2,
      uniqueItems: true,
      items: {
        type: "string",
      },
    }

    const expected = ["string"]

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should handle minItems with example", () => {
    const definition = {
      type: "array",
      minItems: 2,
      items: {
        type: "string",
        example: "some",
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
            type: "string",
          },
          {
            type: "number",
          },
        ],
      },
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
            type: "string",
          },
          {
            type: "number",
          },
        ],
      },
    }

    const expected = ["string"]

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should handle contains", () => {
    const definition = {
      type: "array",
      contains: {
        type: "number",
      },
    }

    const expected = [0]

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should handle contains with items", () => {
    const definition = {
      type: "array",
      items: {
        type: "string",
      },
      contains: {
        type: "number",
      },
    }

    const expected = [0, "string"]

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should handle minContains", () => {
    const definition = {
      type: "array",
      minContains: 3,
      contains: {
        type: "number",
      },
    }

    const expected = [0, 0, 0]

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should handle minContains with minItems", () => {
    const definition = {
      type: "array",
      minContains: 3,
      minItems: 4,
      contains: {
        type: "number",
      },
      items: {
        type: "string",
      },
    }

    const expected = [0, 0, 0, "string"]

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should handle maxContains", () => {
    const definition = {
      type: "array",
      maxContains: 3,
      contains: {
        type: "number",
      },
    }

    const expected = [0]

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should handle maxContains with maxItems", () => {
    const definition = {
      type: "array",
      maxContains: 10,
      maxItem: 10,
      contains: {
        type: "number",
      },
      items: {
        type: "string",
      },
    }

    const expected = [0, "string"]

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

  it("should handle exclusiveMinimum", () => {
    const definition = {
      type: "number",
      exclusiveMinimum: 5,
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

  it("should handle exclusiveMaximum", () => {
    const definition = {
      type: "number",
      exclusiveMaximum: -1,
    }

    const expected = -2

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should handle multipleOf", () => {
    const definition = {
      type: "number",
      minimum: 22,
      multipleOf: 3,
    }

    const expected = 24

    expect(sampleFromSchema(definition)).toStrictEqual(expected)
  })

  it("should handle minLength", () => {
    const definition = {
      type: "string",
      minLength: 7,
    }

    const expected = "strings"

    expect(sampleFromSchema(definition)).toEqual(expected)
  })

  it("should handle maxLength", () => {
    const definition = {
      type: "string",
      maxLength: 3,
    }

    const expected = "str"

    expect(sampleFromSchema(definition)).toEqual(expected)
  })
})

describe("createXMLExample", function () {
  let sut = createXMLExample
  describe("simple types with xml property", function () {
    it('returns tag <newtagname>string</newtagname> when passing type string and xml:{name: "newtagname"}', function () {
      const definition = {
        type: "string",
        xml: {
          name: "newtagname",
        },
      }

      expect(sut(definition)).toEqual(
        '<?xml version="1.0" encoding="UTF-8"?>\n<newtagname>string</newtagname>'
      )
    })

    it('returns tag <test:newtagname>string</test:newtagname> when passing type string and xml:{name: "newtagname", prefix:"test"}', function () {
      const definition = {
        type: "string",
        xml: {
          name: "newtagname",
          prefix: "test",
        },
      }

      expect(sut(definition)).toEqual(
        '<?xml version="1.0" encoding="UTF-8"?>\n<test:newtagname>string</test:newtagname>'
      )
    })

    it('returns tag <test:tagname xmlns:sample="http://swagger.io/schema/sample">string</test:tagname> when passing type string and xml:{"namespace": "http://swagger.io/schema/sample", "prefix": "sample"}', function () {
      const definition = {
        type: "string",
        xml: {
          namespace: "http://swagger.io/schema/sample",
          prefix: "sample",
          name: "name",
        },
      }

      expect(sut(definition)).toEqual(
        '<?xml version="1.0" encoding="UTF-8"?>\n<sample:name xmlns:sample="http://swagger.io/schema/sample">string</sample:name>'
      )
    })

    it('returns tag <test:tagname >string</test:tagname> when passing type string and xml:{"namespace": "http://swagger.io/schema/sample"}', function () {
      const definition = {
        type: "string",
        xml: {
          namespace: "http://swagger.io/schema/sample",
          name: "name",
        },
      }

      expect(sut(definition)).toEqual(
        '<?xml version="1.0" encoding="UTF-8"?>\n<name xmlns="http://swagger.io/schema/sample">string</name>'
      )
    })

    it("returns tag <newtagname>test</newtagname> when passing default value", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<newtagname>test</newtagname>'
      const definition = {
        type: "string",
        default: "test",
        xml: {
          name: "newtagname",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns default value when enum provided", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<newtagname>one</newtagname>'
      const definition = {
        type: "string",
        default: "one",
        enum: ["two", "one"],
        xml: {
          name: "newtagname",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns example value when provided", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<newtagname>one</newtagname>'
      const definition = {
        type: "string",
        default: "one",
        example: "two",
        enum: ["two", "one"],
        xml: {
          name: "newtagname",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns item from examples value when provided", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<newtagname>three</newtagname>'
      const definition = {
        type: "string",
        default: "one",
        example: "two",
        examples: ["three", "four"],
        enum: ["two", "one"],
        xml: {
          name: "newtagname",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("sets first enum if provided", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<newtagname>one</newtagname>'
      const definition = {
        type: "string",
        enum: ["one", "two"],
        xml: {
          name: "newtagname",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })
  })

  describe("array", function () {
    it("returns tag <tagname>string</tagname> when passing string items", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<tagname>string</tagname>'
      const definition = {
        type: "array",
        items: {
          type: "string",
        },
        xml: {
          name: "tagname",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns tag <animal>string</animal> when passing string items with name", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<animal>string</animal>'
      const definition = {
        type: "array",
        items: {
          type: "string",
          xml: {
            name: "animal",
          },
        },
        xml: {
          name: "animals",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns tag <animals><animal>string</animal></animals> when passing string items with name", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<animals>\n\t<animal>string</animal>\n</animals>'
      const definition = {
        type: "array",
        items: {
          type: "string",
          xml: {
            name: "animal",
          },
        },
        xml: {
          wrapped: true,
          name: "animals",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("return correct nested wrapped array", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<aliens>\n\t<dog>string</dog>\n</aliens>'
      const definition = {
        type: "array",
        items: {
          type: "array",
          items: {
            type: "string",
          },
          xml: {
            name: "dog",
          },
        },
        xml: {
          wrapped: true,
          name: "aliens",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("return correct nested wrapped array with xml", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<aliens>\n\t<dogs>\n\t\t<dog>string</dog>\n\t</dogs>\n</aliens>'
      const definition = {
        type: "array",
        items: {
          type: "array",
          items: {
            type: "string",
            xml: {
              name: "dog",
            },
          },
          xml: {
            name: "dogs",
            wrapped: true,
          },
        },
        xml: {
          wrapped: true,
          name: "aliens",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("adds namespace to array", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<dog xmlns="test">string</dog>'
      const definition = {
        type: "array",
        items: {
          type: "string",
          xml: {
            name: "dog",
            namespace: "test",
          },
        },
        xml: {
          name: "aliens",
          namespace: "test_new",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("adds prefix to array", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<test:dog>string</test:dog>'
      const definition = {
        type: "array",
        items: {
          type: "string",
          xml: {
            name: "dog",
            prefix: "test",
          },
        },
        xml: {
          name: "aliens",
          prefix: "test_new",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("adds prefix to array with no xml in items", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<test:dog>string</test:dog>'
      const definition = {
        type: "array",
        items: {
          type: "string",
        },
        xml: {
          name: "dog",
          prefix: "test",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("adds namespace to array with no xml in items", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<dog xmlns="test">string</dog>'
      const definition = {
        type: "array",
        items: {
          type: "string",
        },
        xml: {
          name: "dog",
          namespace: "test",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("adds namespace to array with wrapped", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<aliens xmlns="test">\n\t<dog>string</dog>\n</aliens>'
      const definition = {
        type: "array",
        items: {
          type: "string",
          xml: {
            name: "dog",
          },
        },
        xml: {
          wrapped: true,
          name: "aliens",
          namespace: "test",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("adds prefix to array with wrapped", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<test:aliens>\n\t<dog>string</dog>\n</test:aliens>'
      const definition = {
        type: "array",
        items: {
          type: "string",
          xml: {
            name: "dog",
          },
        },
        xml: {
          wrapped: true,
          name: "aliens",
          prefix: "test",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns wrapped array when type is not passed", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<animals>\n\t<animal>string</animal>\n</animals>'
      const definition = {
        items: {
          type: "string",
          xml: {
            name: "animal",
          },
        },
        xml: {
          wrapped: true,
          name: "animals",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns array with default values", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<animal>one</animal>\n<animal>two</animal>'
      const definition = {
        items: {
          type: "string",
          xml: {
            name: "animal",
          },
        },
        default: ["one", "two"],
        xml: {
          name: "animals",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns array with default values with wrapped=true", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<animals>\n\t<animal>one</animal>\n\t<animal>two</animal>\n</animals>'
      const definition = {
        items: {
          type: "string",
          xml: {
            name: "animal",
          },
        },
        default: ["one", "two"],
        xml: {
          wrapped: true,
          name: "animals",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns array with default values", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<animal>one</animal>'
      const definition = {
        items: {
          type: "string",
          enum: ["one", "two"],
          xml: {
            name: "animal",
          },
        },
        xml: {
          name: "animals",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns array with default values with wrapped=true", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<animals>\n\t<animal>1</animal>\n\t<animal>2</animal>\n</animals>'
      const definition = {
        items: {
          enum: ["one", "two"],
          type: "string",
          xml: {
            name: "animal",
          },
        },
        default: ["1", "2"],
        xml: {
          wrapped: true,
          name: "animals",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns array with example values  with ", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<animals>\n\t<animal>1</animal>\n\t<animal>2</animal>\n</animals>'
      const definition = {
        type: "object",
        properties: {
          animal: {
            type: "array",
            items: {
              type: "string",
            },
            example: ["1", "2"],
          },
        },
        xml: {
          name: "animals",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns array with example values  with wrapped=true", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<animals>\n\t<animal>1</animal>\n\t<animal>2</animal>\n</animals>'
      const definition = {
        type: "array",
        items: {
          type: "string",
          xml: {
            name: "animal",
          },
        },
        example: ["1", "2"],
        xml: {
          wrapped: true,
          name: "animals",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns array of objects with example values  with wrapped=true", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<users>\n\t<user>\n\t\t<id>1</id>\n\t\t<name>Arthur Dent</name>\n\t</user>\n\t<user>\n\t\t<id>2</id>\n\t\t<name>Ford Prefect</name>\n\t</user>\n</users>'
      const definition = {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "integer",
            },
            name: {
              type: "string",
            },
          },
          xml: {
            name: "user",
          },
        },
        xml: {
          name: "users",
          wrapped: true,
        },
        example: [
          {
            id: 1,
            name: "Arthur Dent",
          },
          {
            id: 2,
            name: "Ford Prefect",
          },
        ],
      }

      expect(sut(definition)).toEqual(expected)
    })
    it("should return additionalProperty example", () => {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<aliens>\n\t<notalien>test</notalien>\n</aliens>'
      const definition = {
        type: "array",
        items: {
          type: "object",
          properties: {
            alien: {
              type: "string",
            },
            dog: {
              type: "integer",
            },
          },
        },
        xml: {
          name: "aliens",
        },
      }

      expect(sut(definition, {}, [{ notalien: "test" }])).toEqual(expected)
    })
    it("should return literal example", () => {
      const expected = "<notaliens>\n\t\n\t<dog>0</dog>\n</notaliens>"
      const definition = {
        type: "array",
        items: {
          properties: {
            alien: {
              type: "string",
            },
            dog: {
              type: "integer",
            },
          },
        },
        xml: {
          name: "aliens",
        },
      }

      expect(sut(definition, {}, expected)).toEqual(expected)
    })
  })

  describe("object", function () {
    it("returns object with 2 properties", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<aliens>\n\t<alien>string</alien>\n\t<dog>0</dog>\n</aliens>'
      const definition = {
        type: "object",
        properties: {
          alien: {
            type: "string",
          },
          dog: {
            type: "integer",
          },
        },
        xml: {
          name: "aliens",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns object with integer property and array property", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<animals>\n\t<aliens>string</aliens>\n\t<dog>0</dog>\n</animals>'
      const definition = {
        type: "object",
        properties: {
          aliens: {
            type: "array",
            items: {
              type: "string",
            },
          },
          dog: {
            type: "integer",
          },
        },
        xml: {
          name: "animals",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns nested objects", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<animals>\n\t<aliens>\n\t\t<alien>string</alien>\n\t</aliens>\n\t<dog>string</dog>\n</animals>'
      const definition = {
        type: "object",
        properties: {
          aliens: {
            type: "object",
            properties: {
              alien: {
                type: "string",
                xml: {
                  name: "alien",
                },
              },
            },
          },
          dog: {
            type: "string",
          },
        },
        xml: {
          name: "animals",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns object with no readonly fields for parameter", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<animals>\n\t<id>0</id>\n</animals>'
      const definition = {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          dog: {
            readOnly: true,
            type: "string",
          },
        },
        xml: {
          name: "animals",
        },
      }

      expect(sut(definition, { includeReadOnly: false })).toEqual(expected)
    })

    it("returns object with readonly fields for parameter, with includeReadOnly", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<animals>\n\t<id>0</id>\n\t<dog>string</dog>\n</animals>'
      const definition = {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          dog: {
            readOnly: true,
            type: "string",
          },
        },
        xml: {
          name: "animals",
        },
      }

      expect(sut(definition, { includeReadOnly: true })).toEqual(expected)
    })

    it("returns object without writeonly fields for parameter", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<animals>\n\t<id>0</id>\n</animals>'
      const definition = {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          dog: {
            writeOnly: true,
            type: "string",
          },
        },
        xml: {
          name: "animals",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns object with writeonly fields for parameter, with includeWriteOnly", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<animals>\n\t<id>0</id>\n\t<dog>string</dog>\n</animals>'
      const definition = {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          dog: {
            writeOnly: true,
            type: "string",
          },
        },
        xml: {
          name: "animals",
        },
      }

      expect(sut(definition, { includeWriteOnly: true })).toEqual(expected)
    })

    it("returns object with passed property as attribute", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<animals id="0">\n\t<dog>string</dog>\n</animals>'
      const definition = {
        type: "object",
        properties: {
          id: {
            type: "integer",
            xml: {
              attribute: true,
            },
          },
          dog: {
            type: "string",
          },
        },
        xml: {
          name: "animals",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns object with passed property as attribute with custom name", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<animals test="0">\n\t<dog>string</dog>\n</animals>'
      const definition = {
        type: "object",
        properties: {
          id: {
            type: "integer",
            xml: {
              attribute: true,
              name: "test",
            },
          },
          dog: {
            type: "string",
          },
        },
        xml: {
          name: "animals",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns object with example values in attribute", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<user id="42">\n\t<role>admin</role>\n</user>'
      const definition = {
        type: "object",
        properties: {
          id: {
            type: "integer",
            xml: {
              attribute: true,
            },
          },
          role: {
            type: "string",
          },
        },
        xml: {
          name: "user",
        },
        example: {
          id: 42,
          role: "admin",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns object with enum values in attribute", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<user id="one">\n\t<role>string</role>\n</user>'
      const definition = {
        type: "object",
        properties: {
          id: {
            type: "string",
            enum: ["one", "two"],
            xml: {
              attribute: true,
            },
          },
          role: {
            type: "string",
          },
        },
        xml: {
          name: "user",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns object with default values in attribute", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<user id="one">\n\t<role>string</role>\n</user>'
      const definition = {
        type: "object",
        properties: {
          id: {
            type: "string",
            default: "one",
            xml: {
              attribute: true,
            },
          },
          role: {
            type: "string",
          },
        },
        xml: {
          name: "user",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns object with default values in attribute", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<user id="one">\n\t<role>string</role>\n</user>'
      const definition = {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: "one",
            xml: {
              attribute: true,
            },
          },
          role: {
            type: "string",
          },
        },
        xml: {
          name: "user",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns object with example value", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<user>\n\t<id>42</id>\n\t<role>admin</role>\n</user>'
      const definition = {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          role: {
            type: "string",
          },
        },
        xml: {
          name: "user",
        },
        example: {
          id: 42,
          role: "admin",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns object with additional props", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<animals>\n\t<dog>string</dog>\n\t<additionalProp1>string</additionalProp1>\n\t<additionalProp2>string</additionalProp2>\n\t<additionalProp3>string</additionalProp3>\n</animals>'
      const definition = {
        type: "object",
        properties: {
          dog: {
            type: "string",
          },
        },
        additionalProperties: {
          type: "string",
        },
        xml: {
          name: "animals",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns object with additional props =true", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<animals>\n\t<dog>string</dog>\n\t<additionalProp>Anything can be here</additionalProp>\n</animals>'
      const definition = {
        type: "object",
        properties: {
          dog: {
            type: "string",
          },
        },
        additionalProperties: true,
        xml: {
          name: "animals",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns object with 2 properties with no type passed but properties", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<aliens>\n\t<alien>string</alien>\n\t<dog>0</dog>\n</aliens>'
      const definition = {
        properties: {
          alien: {
            type: "string",
          },
          dog: {
            type: "integer",
          },
        },
        xml: {
          name: "aliens",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns object with additional props with no type passed", function () {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<animals>\n\t<additionalProp1>string</additionalProp1>\n\t<additionalProp2>string</additionalProp2>\n\t<additionalProp3>string</additionalProp3>\n</animals>'
      const definition = {
        additionalProperties: {
          type: "string",
        },
        xml: {
          name: "animals",
        },
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("should use overrideExample when defined", () => {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<bar>\n\t<foo>override</foo>\n</bar>'

      const definition = {
        type: "object",
        properties: {
          foo: {
            type: "string",
            xml: {
              name: "foo",
            },
          },
        },
        example: {
          foo: null,
        },
        xml: {
          name: "bar",
        },
      }

      const overrideExample = {
        foo: "override",
      }

      expect(sut(definition, {}, overrideExample)).toEqual(expected)
    })

    it("should return additionalProperty example", () => {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<aliens>\n\t<alien>test</alien>\n\t<dog>1</dog>\n</aliens>'
      const definition = {
        type: "object",
        properties: {
          alien: {
            type: "string",
          },
          dog: {
            type: "integer",
          },
        },
        xml: {
          name: "aliens",
        },
      }

      expect(sut(definition, {}, { alien: "test", dog: 1 })).toEqual(expected)
    })
    it("should return literal example", () => {
      const expected = "<notaliens>\n\t\n\t<dog>0</dog>\n</notaliens>"
      const definition = {
        type: "object",
        properties: {
          alien: {
            type: "string",
          },
          dog: {
            type: "integer",
          },
        },
        xml: {
          name: "aliens",
        },
      }

      expect(sut(definition, {}, expected)).toEqual(expected)
    })
    it("should use exampleOverride for attr too", () => {
      const expected =
        '<?xml version="1.0" encoding="UTF-8"?>\n<aliens test="probe">\n</aliens>'
      const definition = {
        type: "object",
        properties: {
          test: {
            type: "string",
            xml: {
              attribute: true,
            },
          },
        },
        xml: {
          name: "aliens",
        },
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
        name: "probe",
      },
      properties: {
        foo: {
          type: "string",
        },
        swaggerUi: {
          type: "string",
          example: "cool",
        },
      },
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
          type: "string",
        },
      },
      example: {
        foo: null,
      },
    }

    const expected = {
      foo: "override",
    }
    expect(memoizedSampleFromSchema(definition, {}, expected)).toEqual(expected)

    const updatedExpected = {
      foo: "cat",
    }
    expect(memoizedSampleFromSchema(definition, {}, updatedExpected)).toEqual(
      updatedExpected
    )
  })
})

describe("memoizedCreateXMLExample", () => {
  it("should sequentially update memoized overrideExample", () => {
    const expected =
      '<?xml version="1.0" encoding="UTF-8"?>\n<bar>\n\t<foo>override</foo>\n</bar>'

    const definition = {
      type: "object",
      properties: {
        foo: {
          type: "string",
          xml: {
            name: "foo",
          },
        },
      },
      example: {
        foo: null,
      },
      xml: {
        name: "bar",
      },
    }

    const overrideExample = {
      foo: "override",
    }
    expect(memoizedCreateXMLExample(definition, {}, overrideExample)).toEqual(
      expected
    )

    const updatedOverrideExample = {
      foo: "cat",
    }
    const updatedExpected =
      '<?xml version="1.0" encoding="UTF-8"?>\n<bar>\n\t<foo>cat</foo>\n</bar>'
    expect(
      memoizedCreateXMLExample(definition, {}, updatedOverrideExample)
    ).toEqual(updatedExpected)
  })
})
