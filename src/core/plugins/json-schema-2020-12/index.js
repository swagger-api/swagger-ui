/**
 * @prettier
 */
import JSONSchema from "./components/JSONSchema/JSONSchema"
import BooleanJSONSchema from "./components/BooleanJSONSchema/BooleanJSONSchema"
import KeywordProperties from "./components/keywords/Properties"
import KeywordType from "./components/keywords/Type/Type"
import KeywordFormat from "./components/keywords/Format/Format"
import Accordion from "./components/Accordion/Accordion"
import ExpandDeepButton from "./components/ExpandDeepButton/ExpandDeepButton"
import ChevronRightIcon from "./components/icons/ChevronRight"
import { upperFirst } from "./fn"
import { withJSONSchemaContext } from "./hoc"

const JSONSchema202012Plugin = () => ({
  components: {
    JSONSchema202012: JSONSchema,
    BooleanJSONSchema202012: BooleanJSONSchema,
    JSONSchema202012KeywordProperties: KeywordProperties,
    JSONSchema202012KeywordType: KeywordType,
    JSONSchema202012KeywordFormat: KeywordFormat,
    JSONSchema202012Accordion: Accordion,
    JSONSchema202012ExpandDeepButton: ExpandDeepButton,
    JSONSchema202012ChevronRightIcon: ChevronRightIcon,
    withJSONSchema202012Context: withJSONSchemaContext,
  },
  fn: {
    upperFirst,
  },
})

export default JSONSchema202012Plugin
