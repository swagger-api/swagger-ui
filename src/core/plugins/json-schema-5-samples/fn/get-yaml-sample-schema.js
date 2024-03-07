/**
 * @prettier
 */
import YAML, { JSON_SCHEMA } from "js-yaml"

const makeGetYamlSampleSchema =
  (getSystem) => (schema, config, contentType, exampleOverride) => {
    const { fn } = getSystem()
    const jsonExample = fn.getJsonSampleSchema(
      schema,
      config,
      contentType,
      exampleOverride
    )
    let yamlString
    try {
      yamlString = YAML.dump(
        YAML.load(jsonExample),
        {
          lineWidth: -1, // don't generate line folds
        },
        { schema: JSON_SCHEMA }
      )
      if (yamlString[yamlString.length - 1] === "\n") {
        yamlString = yamlString.slice(0, yamlString.length - 1)
      }
    } catch (e) {
      console.error(e)
      return "error: could not generate yaml example"
    }
    return yamlString.replace(/\t/g, "  ")
  }

export default makeGetYamlSampleSchema
