/**
 * @prettier
 */
import BasePreset from "core/presets/base"
import OpenAPI30Plugin from "core/plugins/oas3"
import OpenAPI31Plugin from "core/plugins/oas31"
import OpenAPI32Plugin from "core/plugins/oas32"
import JSONSchemaDocumentPlugin from "core/plugins/json-schema-document"
import JSONSchema202012Plugin from "core/plugins/json-schema-2020-12"
import JSONSchema202012SamplesPlugin from "core/plugins/json-schema-2020-12-samples"

export default function PresetApis() {
  return [
    BasePreset,
    OpenAPI30Plugin,
    JSONSchema202012Plugin,
    JSONSchema202012SamplesPlugin,
    OpenAPI31Plugin,
    OpenAPI32Plugin, // Load LAST of the OpenAPI plugins to override previous versions
    JSONSchemaDocumentPlugin, // wraps the OpenAPI plugins' VersionPragmaFilter
  ]
}
