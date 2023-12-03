/**
 * @prettier
 */
import * as JSONSchemaComponents from "core/components/json-schema-components"

const JSONSchemaComponentsPlugin = () => ({
  components: { ...JSONSchemaComponents },
})

export default JSONSchemaComponentsPlugin
