import React from "react"
import PropTypes from "prop-types"
import swaggerUIConstructor from "./swagger-ui"

export default class SwaggerUI extends React.Component {
  constructor (props) {
    super(props)
    this.SwaggerUIComponent = null
    this.system = null
  }
  
  componentDidMount() {
    const ui = swaggerUIConstructor({
      spec: this.props.spec,
      url: this.props.url,
      requestInterceptor: this.requestInterceptor,
      responseInterceptor: this.responseInterceptor,
      onComplete: this.onComplete,
      docExpansion: this.props.docExpansion,
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
  spec: PropTypes.oneOf([
    PropTypes.string,
    PropTypes.object,
  ]),
  url: PropTypes.string,
  requestInterceptor: PropTypes.func,
  responseInterceptor: PropTypes.func,
  onComplete: PropTypes.func,
  docExpansion: PropTypes.oneOf(['list', 'full', 'none']),
}
