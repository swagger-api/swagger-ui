import React from "react"
import PropTypes from "prop-types"
import swaggerUIConstructor, {presets} from "./swagger-ui"
export default class SwaggerUI extends React.Component {
  constructor (props) {
    super(props)
    this.SwaggerUIComponent = null
    this.system = null
  }

  componentDidMount() {
    const ui = swaggerUIConstructor({
      plugins: this.props.plugins,
      spec: this.props.spec,
      url: this.props.url,
      layout: this.props.layout,
      defaultModelsExpandDepth: this.props.defaultModelsExpandDepth,
      presets: [presets.apis,...this.props.presets],
      requestInterceptor: this.requestInterceptor,
      responseInterceptor: this.responseInterceptor,
      onComplete: this.onComplete,
      docExpansion: this.props.docExpansion,
      supportedSubmitMethods: this.props.supportedSubmitMethods,
      defaultModelExpandDepth: this.props.defaultModelExpandDepth,
      displayOperationId: this.props.displayOperationId,
      tryItOutEnabled: this.props.tryItOutEnabled,
      showMutatedRequest: typeof this.props.showMutatedRequest === "boolean" ? this.props.showMutatedRequest : true,
      deepLinking: typeof this.props.deepLinking === "boolean" ? this.props.deepLinking : false,
    })

    this.system = ui
    this.SwaggerUIComponent = ui.getComponent("App", "root")

    this.forceUpdate()
  }

  render() {
    return this.SwaggerUIComponent ? <this.SwaggerUIComponent /> : null
  }

  componentDidUpdate(prevProps) {
    if(this.props.url !== prevProps.url) {
      // flush current content
      this.system.specActions.updateSpec("")

      if(this.props.url) {
        // update the internal URL
        this.system.specActions.updateUrl(this.props.url)
        // trigger remote definition fetch
        this.system.specActions.download(this.props.url)
      }
    }

    if(this.props.spec !== prevProps.spec && this.props.spec) {
      if(typeof this.props.spec === "object") {
        this.system.specActions.updateSpec(JSON.stringify(this.props.spec))
      } else {
        this.system.specActions.updateSpec(this.props.spec)
      }
    }
  }

  requestInterceptor = (req) => {
    if (typeof this.props.requestInterceptor === "function") {
      return this.props.requestInterceptor(req)
    }
    return req
  }

  responseInterceptor = (res) => {
    if (typeof this.props.responseInterceptor === "function") {
      return this.props.responseInterceptor(res)
    }
    return res
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
  plugins: PropTypes.arrayOf(PropTypes.object),
  displayOperationId: PropTypes.bool,
  showMutatedRequest: PropTypes.bool,
  defaultModelExpandDepth: PropTypes.number,
  defaultModelsExpandDepth: PropTypes.number,
  presets: PropTypes.arrayOf(PropTypes.func),
  deepLinking: PropTypes.bool,
  tryItOutEnabled: PropTypes.bool
}

SwaggerUI.defaultProps = {
  layout: "BaseLayout",
  supportedSubmitMethods: ["get", "put", "post", "delete", "options", "head", "patch", "trace"],
  docExpansion: "list",
  defaultModelsExpandDepth: 1,
  presets: [],
  deepLinking: false,
}
