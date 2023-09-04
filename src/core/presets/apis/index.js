/**
 * @prettier
 */
import BasePreset from "core/presets/base"
import OpenAPI30Plugin from "core/plugins/oas3"
import OpenAPI31Plugin from "core/plugins/oas31"
import JSONSchema202012Plugin from "core/plugins/json-schema-2020-12"

export default function PresetApis() {
  return [BasePreset, OpenAPI30Plugin, JSONSchema202012Plugin, OpenAPI31Plugin]
}
