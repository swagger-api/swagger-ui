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
      url: this.props.url,
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
      // update the internal URL
      this.system.specActions.updateUrl(this.props.url)
      // trigger remote definition fetch
      this.system.specActions.download(this.props.url)
    }
  }
}

SwaggerUI.propTypes = {
  url: PropTypes.string,
}