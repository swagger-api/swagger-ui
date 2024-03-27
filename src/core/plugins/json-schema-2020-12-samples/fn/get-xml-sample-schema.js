/**
 * @prettier
 */
const makeGetXmlSampleSchema =
  (getSystem) => (schema, config, exampleOverride) => {
    const { fn } = getSystem()

    if (schema && !schema.xml) {
      schema.xml = {}
    }
    if (schema && !schema.xml.name) {
      if (
        !schema.$$ref &&
        (schema.type ||
          schema.items ||
          schema.properties ||
          schema.additionalProperties)
      ) {
        // eslint-disable-next-line quotes
        return '<?xml version="1.0" encoding="UTF-8"?>\n<!-- XML example cannot be generated; root element name is undefined -->'
      }
      if (schema.$$ref) {
        let match = schema.$$ref.match(/\S*\/(\S+)$/)
        schema.xml.name = match[1]
      }
    }

    return fn.jsonSchema202012.memoizedCreateXMLExample(
      schema,
      config,
      exampleOverride
    )
  }

export default makeGetXmlSampleSchema
