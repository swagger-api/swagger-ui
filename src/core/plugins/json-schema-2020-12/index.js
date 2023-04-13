/**
 * @prettier
 */
import JSONSchema from "./components/JSONSchema/JSONSchema"
import BooleanJSONSchema from "./components/BooleanJSONSchema/BooleanJSONSchema"
import Accordion from "./components/Accordion/Accordion"
import ChevronRightIcon from "./components/icons/ChevronRight"
import { upperFirst } from "./fn"
import { withJSONSchemaContext } from "./hoc"

const JSONSchema202012Plugin = () => ({
  components: {
    JSONSchema202012: JSONSchema,
    BooleanJSONSchema202012: BooleanJSONSchema,
    JSONSchema202012Accordion: Accordion,
    JSONSchema202012ChevronRightIcon: ChevronRightIcon,
    withJSONSchema202012Context: withJSONSchemaContext,
  },
  fn: {
    upperFirst,
  },
})

export default JSONSchema202012Plugin
