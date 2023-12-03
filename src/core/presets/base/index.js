/**
 * @prettier
 */
import AuthPlugin from "core/plugins/auth/"
import ConfigsPlugin from "core/plugins/configs"
import DeepLinkingPlugin from "core/plugins/deep-linking"
import ErrPlugin from "core/plugins/err"
import FilterPlugin from "core/plugins/filter"
import IconsPlugin from "core/plugins/icons"
import LayoutPlugin from "core/plugins/layout"
import LogsPlugin from "core/plugins/logs"
import OnCompletePlugin from "core/plugins/on-complete"
import RequestSnippetsPlugin from "core/plugins/request-snippets"
import JSONSchema5SamplesPlugin from "core/plugins/json-schema-5-samples"
import SpecPlugin from "core/plugins/spec"
import SwaggerClientPlugin from "core/plugins/swagger-client"
import UtilPlugin from "core/plugins/util"
import ViewPlugin from "core/plugins/view"
import DownloadUrlPlugin from "core/plugins/download-url"
import SafeRenderPlugin from "core/plugins/safe-render"
// ad-hoc plugins
import CoreComponentsPlugin from "core/presets/base/plugins/core-components"
import FormComponentsPlugin from "core/presets/base/plugins/form-components"
import JSONSchemaComponentsPlugin from "core/presets/base/plugins/json-schema-components"

const BasePreset = () => [
  ConfigsPlugin,
  UtilPlugin,
  LogsPlugin,
  ViewPlugin,
  SpecPlugin,
  ErrPlugin,
  IconsPlugin,
  LayoutPlugin,
  JSONSchema5SamplesPlugin,
  CoreComponentsPlugin,
  FormComponentsPlugin,
  SwaggerClientPlugin,
  JSONSchemaComponentsPlugin,
  AuthPlugin,
  DownloadUrlPlugin,
  DeepLinkingPlugin,
  FilterPlugin,
  OnCompletePlugin,
  RequestSnippetsPlugin,
  SafeRenderPlugin(),
]

export default BasePreset
