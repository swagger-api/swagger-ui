import React from "react"
import PropTypes from "prop-types"
import SwaggerUIConstructor from "#swagger-ui"

class SwaggerUI extends React.Component {
  constructor (props) {
    super(props)
    this.SwaggerUIComponent = null
    this.system = null
  }

  componentDidMount() {
    const ui = SwaggerUIConstructor({
      plugins: this.props.plugins,
      spec: this.props.spec,
      url: this.props.url,
      layout: this.props.layout,
      defaultModelsExpandDepth: this.props.defaultModelsExpandDepth,
      defaultModelRendering: this.props.defaultModelRendering,
      presets: [SwaggerUIConstructor.presets.apis, ...this.props.presets],
      requestInterceptor: this.props.requestInterceptor,
      responseInterceptor: this.props.responseInterceptor,
      onComplete: this.onComplete,
      docExpansion: this.props.docExpansion,
      supportedSubmitMethods: this.props.supportedSubmitMethods,
      queryConfigEnabled: this.props.queryConfigEnabled,
      defaultModelExpandDepth: this.props.defaultModelExpandDepth,
      displayOperationId: this.props.displayOperationId,
      tryItOutEnabled: this.props.tryItOutEnabled,
      displayRequestDuration: this.props.displayRequestDuration,
      requestSnippetsEnabled: this.props.requestSnippetsEnabled,
      requestSnippets: this.props.requestSnippets,
      showMutatedRequest: this.props.showMutatedRequest,
      deepLinking: this.props.deepLinking,
      showExtensions: this.props.showExtensions,
      showCommonExtensions: this.props.showCommonExtensions,
      filter: this.props.filter,
      persistAuthorization: this.props.persistAuthorization,
      withCredentials: this.props.withCredentials,
      ...(typeof this.props.oauth2RedirectUrl === "string" ? { oauth2RedirectUrl: this.props.oauth2RedirectUrl} : {})
    })

    this.system = ui
    this.SwaggerUIComponent = ui.getComponent("App", "root")

    this.forceUpdate()
  }

  render() {
    return this.SwaggerUIComponent ? <this.SwaggerUIComponent /> : null
  }

  componentDidUpdate(prevProps) {
    const prevStateUrl = this.system.specSelectors.url()
    if(this.props.url !== prevStateUrl || this.props.url !== prevProps.url) {
      // flush current content
      this.system.specActions.updateSpec("")

      if(this.props.url) {
        // update the internal URL
        this.system.specActions.updateUrl(this.props.url)
        // trigger remote definition fetch
        this.system.specActions.download(this.props.url)
      }
    }

    const prevStateSpec = this.system.specSelectors.specStr()
    if(this.props.spec && (this.props.spec !== prevStateSpec || this.props.spec !== prevProps.spec)) {
      if(typeof this.props.spec === "object") {
        this.system.specActions.updateSpec(JSON.stringify(this.props.spec))
      } else {
        this.system.specActions.updateSpec(this.props.spec)
      }
    }
  }

  onComplete = () => {
    if (typeof this.props.onComplete === "function") {
      return this.props.onComplete(this.system)
    }
  }
}

SwaggerUI.propTypes = {
  spec: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  url: PropTypes.string,
  layout: PropTypes.string,
  requestInterceptor: PropTypes.func,
  responseInterceptor: PropTypes.func,
  onComplete: PropTypes.func,
  docExpansion: PropTypes.oneOf(["list", "full", "none"]),
  supportedSubmitMethods: PropTypes.arrayOf(
    PropTypes.oneOf(["get", "put", "post", "delete", "options", "head", "patch", "trace"])
  ),
  queryConfigEnabled: PropTypes.bool,
  plugins: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.object),
    PropTypes.arrayOf(PropTypes.func),
    PropTypes.func,
  ]),
  displayOperationId: PropTypes.bool,
  showMutatedRequest: PropTypes.bool,
  defaultModelExpandDepth: PropTypes.number,
  defaultModelsExpandDepth: PropTypes.number,
  defaultModelRendering: PropTypes.oneOf(["example", "model"]),
  presets: PropTypes.arrayOf(PropTypes.func),
  deepLinking: PropTypes.bool,
  showExtensions: PropTypes.bool,
  showCommonExtensions: PropTypes.bool,
  filter: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  requestSnippetsEnabled: PropTypes.bool,
  requestSnippets: PropTypes.object,
  tryItOutEnabled: PropTypes.bool,
  displayRequestDuration: PropTypes.bool,
  persistAuthorization: PropTypes.bool,
  withCredentials: PropTypes.bool,
  oauth2RedirectUrl: PropTypes.string,
}

SwaggerUI.defaultProps = {
  spec: "",
  url: "",
  layout: "BaseLayout",
  requestInterceptor: req => req,
  responseInterceptor: res => res,
  supportedSubmitMethods: ["get", "put", "post", "delete", "options", "head", "patch", "trace"],
  queryConfigEnabled: false,
  plugins: [],
  displayOperationId: false,
  showMutatedRequest: true,
  docExpansion: "list",
  defaultModelExpandDepth: 1,
  defaultModelsExpandDepth: 1,
  defaultModelRendering: "example",
  presets: [],
  deepLinking: false,
  showExtensions: false,
  showCommonExtensions: false,
  filter: null,
  requestSnippetsEnabled: false,
  requestSnippets: {
    generators: {
      "curl_bash": {
        title: "cURL (bash)",
        syntax: "bash"
      },
      "curl_powershell": {
        title: "cURL (PowerShell)",
        syntax: "powershell"
      },
      "curl_cmd": {
        title: "cURL (CMD)",
        syntax: "bash"
      },
    },
    defaultExpanded: true,
    languages: null, // e.g. only show curl bash = ["curl_bash"]
  },
  tryItOutEnabled: false,
  displayRequestDuration: false,
  withCredentials: undefined,
  persistAuthorization: false,
  oauth2RedirectUrl: undefined,
}

SwaggerUI.System = SwaggerUIConstructor.System
SwaggerUI.presets = SwaggerUIConstructor.presets
SwaggerUI.plugins = SwaggerUIConstructor.plugins

export default SwaggerUI
