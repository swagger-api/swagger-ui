/**
 * @prettier
 */
import BasePreset from "./base"
import OAS3Plugin from "../plugins/oas3"
import OAS31Plugin from "../plugins/oas31"

export default function PresetApis() {
  return [BasePreset, OAS3Plugin, OAS31Plugin]
}
