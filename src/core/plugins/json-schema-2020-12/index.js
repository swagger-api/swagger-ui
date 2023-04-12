/**
 * @prettier
 */
import JSONSchema from "./components/JSONSchema/JSONSchema"
import BooleanJSONSchema from "./components/BooleanJSONSchema/BooleanJSONSchema"
import { upperFirst } from "./fn"
import { withJSONSchemaContext } from "./hoc"

const JSONSchema202012Plugin = () => ({
  components: {
    JSONSchema202012: JSONSchema,
    BooleanJSONSchema202012: BooleanJSONSchema,
    withJSONSchema202012Context: withJSONSchemaContext,
  },
  fn: {
    upperFirst,
  },
})

export default JSONSchema202012Plugin
