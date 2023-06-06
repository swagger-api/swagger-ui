/**
 * @prettier
 */
import BasePreset from "./base"
import ViewReact17Plugin from "../plugins/view-react-17"
import OAS3Plugin from "../plugins/oas3"
import OAS31Plugin from "../plugins/oas31"
import JSONSchema202012Plugin from "../plugins/json-schema-2020-12"

export default function PresetApis() {
  return [
    BasePreset,
    ViewReact17Plugin,
    OAS3Plugin,
    JSONSchema202012Plugin,
    OAS31Plugin,
  ]
}
