/**
 * @prettier
 */
const makeGetSampleSchema =
  (getSystem) =>
  (schema, contentType = "", config = {}, exampleOverride = undefined) => {
    const { fn } = getSystem()

    if (typeof schema?.toJS === "function") {
      schema = schema.toJS()
    }
    if (typeof exampleOverride?.toJS === "function") {
      exampleOverride = exampleOverride.toJS()
    }

    if (/xml/.test(contentType)) {
      return fn.jsonSchema202012.getXmlSampleSchema(
        schema,
        config,
        exampleOverride
      )
    }
    if (/(yaml|yml)/.test(contentType)) {
      return fn.jsonSchema202012.getYamlSampleSchema(
        schema,
        config,
        contentType,
        exampleOverride
      )
    }
    return fn.jsonSchema202012.getJsonSampleSchema(
      schema,
      config,
      contentType,
      exampleOverride
    )
  }

export default makeGetSampleSchema
