/**
 * @prettier
 */
import App from "core/components/app"
import AuthorizationPopup from "core/components/auth/authorization-popup"
import AuthorizeBtn from "core/components/auth/authorize-btn"
import AuthorizeBtnContainer from "core/containers/authorize-btn"
import AuthorizeOperationBtn from "core/components/auth/authorize-operation-btn"
import Auths from "core/components/auth/auths"
import AuthItem from "core/components/auth/auth-item"
import AuthError from "core/components/auth/error"
import ApiKeyAuth from "core/components/auth/api-key-auth"
import BasicAuth from "core/components/auth/basic-auth"
import Example from "core/components/example"
import ExamplesSelect from "core/components/examples-select"
import ExamplesSelectValueRetainer from "core/components/examples-select-value-retainer"
import Oauth2 from "core/components/auth/oauth2"
import Clear from "core/components/clear"
import LiveResponse from "core/components/live-response"
import OnlineValidatorBadge from "core/components/online-validator-badge"
import Operations from "core/components/operations"
import OperationTag from "core/components/operation-tag"
import Operation from "core/components/operation"
import OperationContainer from "core/containers/OperationContainer"
import OperationSummary from "core/components/operation-summary"
import OperationSummaryMethod from "core/components/operation-summary-method"
import OperationSummaryPath from "core/components/operation-summary-path"
import OperationExt from "core/components/operation-extensions"
import OperationExtRow from "core/components/operation-extension-row"
import Responses from "core/components/responses"
import Response from "core/components/response"
import ResponseExtension from "core/components/response-extension"
import ResponseBody from "core/components/response-body"
import { Parameters } from "core/components/parameters"
import ParameterExt from "core/components/parameter-extension"
import ParameterIncludeEmpty from "core/components/parameter-include-empty"
import ParameterRow from "core/components/parameter-row"
import Execute from "core/components/execute"
import Headers from "core/components/headers"
import Errors from "core/components/errors"
import ContentType from "core/components/content-type"
import Overview from "core/components/overview"
import InitializedInput from "core/components/initialized-input"
import Info, { InfoUrl, InfoBasePath } from "core/components/info"
import InfoContainer from "core/containers/info"
import Contact from "core/components/contact"
import License from "core/components/license"
import JumpToPath from "core/components/jump-to-path"
import CopyToClipboardBtn from "core/components/copy-to-clipboard-btn"
import Footer from "core/components/footer"
import FilterContainer from "core/containers/filter"
import ParamBody from "core/components/param-body"
import Curl from "core/components/curl"
import Property from "core/components/property"
import TryItOutButton from "core/components/try-it-out-button"
import VersionPragmaFilter from "core/components/version-pragma-filter"
import VersionStamp from "core/components/version-stamp"
import OpenAPIVersion from "core/components/openapi-version"
import DeepLink from "core/components/deep-link"
import SvgAssets from "core/components/svg-assets"
import Markdown from "core/components/providers/markdown"
import BaseLayout from "core/components/layouts/base"

const CoreComponentsPlugin = () => ({
  components: {
    App,
    authorizationPopup: AuthorizationPopup,
    authorizeBtn: AuthorizeBtn,
    AuthorizeBtnContainer,
    authorizeOperationBtn: AuthorizeOperationBtn,
    auths: Auths,
    AuthItem: AuthItem,
    authError: AuthError,
    oauth2: Oauth2,
    apiKeyAuth: ApiKeyAuth,
    basicAuth: BasicAuth,
    clear: Clear,
    liveResponse: LiveResponse,
    InitializedInput,
    info: Info,
    InfoContainer,
    InfoUrl,
    InfoBasePath,
    Contact,
    License,
    JumpToPath,
    CopyToClipboardBtn,
    onlineValidatorBadge: OnlineValidatorBadge,
    operations: Operations,
    operation: Operation,
    OperationSummary,
    OperationSummaryMethod,
    OperationSummaryPath,
    responses: Responses,
    response: Response,
    ResponseExtension: ResponseExtension,
    responseBody: ResponseBody,
    parameters: Parameters,
    parameterRow: ParameterRow,
    execute: Execute,
    headers: Headers,
    errors: Errors,
    contentType: ContentType,
    overview: Overview,
    footer: Footer,
    FilterContainer,
    ParamBody: ParamBody,
    curl: Curl,
    Property,
    TryItOutButton,
    Markdown,
    BaseLayout,
    VersionPragmaFilter,
    VersionStamp,
    OperationExt,
    OperationExtRow,
    ParameterExt,
    ParameterIncludeEmpty,
    OperationTag,
    OperationContainer,
    OpenAPIVersion,
    DeepLink,
    SvgAssets,
    Example,
    ExamplesSelect,
    ExamplesSelectValueRetainer,
  },
})

export default CoreComponentsPlugin
