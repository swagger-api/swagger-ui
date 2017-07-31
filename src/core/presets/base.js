import err from "core/plugins/err"
import layout from "core/plugins/layout"
import spec from "core/plugins/spec"
import view from "core/plugins/view"
import samples from "core/plugins/samples"
import logs from "core/plugins/logs"
import ast from "core/plugins/ast"
import swaggerJs from "core/plugins/swagger-js"
import auth from "core/plugins/auth"
import util from "core/plugins/util"
import SplitPaneModePlugin from "core/plugins/split-pane-mode"
import downloadUrlPlugin from "core/plugins/download-url"
import deepLinkingPlugin from "core/plugins/deep-linking"

import App from "core/components/app"
import AuthorizationPopup from "core/components/auth/authorization-popup"
import AuthorizeBtn from "core/components/auth/authorize-btn"
import AuthorizeOperationBtn from "core/components/auth/authorize-operation-btn"
import Auths from "core/components/auth/auths"
import AuthError from "core/components/auth/error"
import ApiKeyAuth from "core/components/auth/api-key-auth"
import BasicAuth from "core/components/auth/basic-auth"
import Oauth2 from "core/components/auth/oauth2"
import Clear from "core/components/clear"
import LiveResponse from "core/components/live-response"
import OnlineValidatorBadge from "core/components/online-validator-badge"
import Operations from "core/components/operations"
import Operation from "core/components/operation"
import HighlightCode from "core/components/highlight-code"
import Responses from "core/components/responses"
import Response from "core/components/response"
import ResponseBody from "core/components/response-body"
import Parameters from "core/components/parameters"
import ParameterRow from "core/components/parameter-row"
import Execute from "core/components/execute"
import Headers from "core/components/headers"
import Errors from "core/components/errors"
import ContentType from "core/components/content-type"
import Overview from "core/components/overview"
import Info from "core/components/info"
import Footer from "core/components/footer"
import ParamBody from "core/components/param-body"
import Curl from "core/components/curl"
import Schemes from "core/components/schemes"
import ModelCollapse from "core/components/model-collapse"
import ModelExample from "core/components/model-example"
import ModelWrapper from "core/components/model-wrapper"
import Model from "core/components/model"
import Models from "core/components/models"
import EnumModel from "core/components/enum-model"
import ObjectModel from "core/components/object-model"
import ArrayModel from "core/components/array-model"
import PrimitiveModel from "core/components/primitive-model"
import TryItOutButton from "core/components/try-it-out-button"
import VersionStamp from "core/components/version-stamp"

import Markdown from "core/components/providers/markdown"

import BaseLayout from "core/components/layouts/base"

import * as LayoutUtils from "core/components/layout-utils"
import * as JsonSchemaComponents from "core/json-schema-components"

export default function() {

  let coreComponents = {
    components: {
      App,
      authorizationPopup: AuthorizationPopup,
      authorizeBtn: AuthorizeBtn,
      authorizeOperationBtn: AuthorizeOperationBtn,
      auths: Auths,
      authError: AuthError,
      oauth2: Oauth2,
      apiKeyAuth: ApiKeyAuth,
      basicAuth: BasicAuth,
      clear: Clear,
      liveResponse: LiveResponse,
      info: Info,
      onlineValidatorBadge: OnlineValidatorBadge,
      operations: Operations,
      operation: Operation,
      highlightCode: HighlightCode,
      responses: Responses,
      response: Response,
      responseBody: ResponseBody,
      parameters: Parameters,
      parameterRow: ParameterRow,
      execute: Execute,
      headers: Headers,
      errors: Errors,
      contentType: ContentType,
      overview: Overview,
      footer: Footer,
      ParamBody: ParamBody,
      curl: Curl,
      schemes: Schemes,
      modelExample: ModelExample,
      ModelWrapper,
      ModelCollapse,
      Model,
      Models,
      EnumModel,
      ObjectModel,
      ArrayModel,
      PrimitiveModel,
      TryItOutButton,
      Markdown,
      BaseLayout,
      VersionStamp
    }
  }

  let formComponents = {
    components: LayoutUtils
  }

  let jsonSchemaComponents = {
    components: JsonSchemaComponents
  }

  return [
    util,
    logs,
    view,
    spec,
    err,
    layout,
    samples,
    coreComponents,
    formComponents,
    swaggerJs,
    jsonSchemaComponents,
    auth,
    ast,
    SplitPaneModePlugin,
    downloadUrlPlugin,
    deepLinkingPlugin
  ]
}
