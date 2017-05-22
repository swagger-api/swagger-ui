import { createXMLExample } from "corePlugins/samples/fn"
import expect from "expect"


describe("createXMLExample", function () {
  var sut = createXMLExample
  describe("simple types with xml property", function () {
    it("returns tag <newtagname>string</newtagname> when passing type string and xml:{name: \"newtagname\"}", function () {
      var definition = {
        type: "string",
        xml: {
          name: "newtagname"
        }
      }

      expect(sut(definition)).toEqual("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<newtagname>string</newtagname>")
    })

    it("returns tag <test:newtagname>string</test:newtagname> when passing type string and xml:{name: \"newtagname\", prefix:\"test\"}", function () {
      var definition = {
        type: "string",
        xml: {
          name: "newtagname",
          prefix: "test"
        }
      }

      expect(sut(definition)).toEqual("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<test:newtagname>string</test:newtagname>")
    })

    it("returns tag <test:tagname xmlns:sample=\"http://swagger.io/schema/sample\">string</test:tagname> when passing type string and xml:{\"namespace\": \"http://swagger.io/schema/sample\", \"prefix\": \"sample\"}", function () {
      var definition = {
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
      var definition = {
        type: "string",
        xml: {
          namespace: "http://swagger.io/schema/sample",
          name: "name"
        }
      }

      expect(sut(definition)).toEqual("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<name xmlns=\"http://swagger.io/schema/sample\">string</name>")
    })

    it("returns tag <newtagname>test</newtagname> when passing default value", function () {
      var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<newtagname>test</newtagname>"
      var definition = {
        type: "string",
        "default": "test",
        xml: {
          name: "newtagname"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })

    it("returns default value when enum provided", function () {
      var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<newtagname>one</newtagname>"
      var definition = {
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
      var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<newtagname>two</newtagname>"
      var definition = {
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
      var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<newtagname>one</newtagname>"
      var definition = {
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
      var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<tagname>string</tagname>"
      var definition = {
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
      var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animal>string</animal>"
      var definition = {
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
      var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animals>\n\t<animal>string</animal>\n</animals>"
      var definition = {
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
      var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<aliens>\n\t<dog>string</dog>\n</aliens>"
      var definition = {
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
      var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<aliens>\n\t<dogs>\n\t\t<dog>string</dog>\n\t</dogs>\n</aliens>"
      var definition = {
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
      var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<dog xmlns=\"test\">string</dog>"
      var definition = {
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
      var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<test:dog>string</test:dog>"
      var definition = {
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
      var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<test:dog>string</test:dog>"
      var definition = {
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
      var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<dog xmlns=\"test\">string</dog>"
      var definition = {
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
      var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<aliens xmlns=\"test\">\n\t<dog>string</dog>\n</aliens>"
      var definition = {
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
      var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<test:aliens>\n\t<dog>string</dog>\n</test:aliens>"
      var definition = {
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
      var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animals>\n\t<animal>string</animal>\n</animals>"
      var definition = {
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
      var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animal>one</animal>\n<animal>two</animal>"
      var definition = {
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
      var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animals>\n\t<animal>one</animal>\n\t<animal>two</animal>\n</animals>"
      var definition = {
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
      var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animal>one</animal>"
      var definition = {
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
      var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animals>\n\t<animal>1</animal>\n\t<animal>2</animal>\n</animals>"
      var definition = {
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
      var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animals>\n\t<animal>1</animal>\n\t<animal>2</animal>\n</animals>"
      var definition = {
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
    var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animals>\n\t<animal>1</animal>\n\t<animal>2</animal>\n</animals>"
    var definition = {
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

})

  describe("object", function () {
    it("returns object with 2 properties", function () {
      var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<aliens>\n\t<alien>string</alien>\n\t<dog>0</dog>\n</aliens>"
      var definition = {
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
      var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animals>\n\t<aliens>string</aliens>\n\t<dog>0</dog>\n</animals>"
      var definition = {
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
      var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animals>\n\t<aliens>\n\t\t<alien>string</alien>\n\t</aliens>\n\t<dog>string</dog>\n</animals>"
      var definition = {
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
      var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animals>\n\t<id>0</id>\n</animals>"
      var definition = {
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

    it("returns object with passed property as attribute", function () {
      var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animals id=\"0\">\n\t<dog>string</dog>\n</animals>"
      var definition = {
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
      var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animals test=\"0\">\n\t<dog>string</dog>\n</animals>"
      var definition = {
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
      var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<user id=\"42\">\n\t<role>admin</role>\n</user>"
      var definition = {
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
      var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<user id=\"one\">\n\t<role>string</role>\n</user>"
      var definition = {
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
      var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<user id=\"one\">\n\t<role>string</role>\n</user>"
      var definition = {
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
      var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<user id=\"one\">\n\t<role>string</role>\n</user>"
      var definition = {
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
      var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<user>\n\t<id>42</id>\n\t<role>admin</role>\n</user>"
      var definition = {
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
      var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animals>\n\t<dog>string</dog>\n\t<additionalProp>string</additionalProp>\n</animals>"
      var definition = {
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
      var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animals>\n\t<dog>string</dog>\n\t<additionalProp>Anything can be here</additionalProp>\n</animals>"
      var definition = {
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
      var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<aliens>\n\t<alien>string</alien>\n\t<dog>0</dog>\n</aliens>"
      var definition = {
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
      var expected = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<animals>\n\t<additionalProp>string</additionalProp>\n</animals>"
      var definition = {
        additionalProperties: {
          type: "string"
        },
        xml: {
          name: "animals"
        }
      }

      expect(sut(definition)).toEqual(expected)
    })
  })
})
