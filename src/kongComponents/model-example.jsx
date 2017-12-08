import React from "react"
import PropTypes from "prop-types"

export default class ModelExample extends React.Component {
  static propTypes = {
    getComponent: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    schema: PropTypes.object.isRequired,
    example: PropTypes.any.isRequired,
    isExecute: PropTypes.bool,
    getConfigs: PropTypes.func.isRequired
  }

  constructor(props, context) {
    super(props, context)
    let { getConfigs } = this.props
    let { defaultModelRendering } = getConfigs()
    if (defaultModelRendering !== "example" && defaultModelRendering !== "model") {
      defaultModelRendering = "example"
    }
    this.state = {
      activeTab: defaultModelRendering
    }
  }

  activeTab = (e) => {
    let { target: { dataset: { name } } } = e

    this.setState({
      activeTab: name
    })
  }

  render() {
    let { getComponent, specSelectors, schema, example, isExecute, getConfigs } = this.props

    return <div className="example">
      <p>Example Value</p>
      <div>
        {example}
      </div>
    </div>
  }

}
