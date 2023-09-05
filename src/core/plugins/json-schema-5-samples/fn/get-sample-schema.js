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
      return fn.getXmlSampleSchema(schema, config, exampleOverride)
    }
    if (/(yaml|yml)/.test(contentType)) {
      return fn.getYamlSampleSchema(
        schema,
        config,
        contentType,
        exampleOverride
      )
    }
    return fn.getJsonSampleSchema(schema, config, contentType, exampleOverride)
  }

export default makeGetSampleSchema
