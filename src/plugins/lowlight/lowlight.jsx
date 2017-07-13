import React, { Component, PropTypes } from "react"
import Lowlight from 'react-lowlight'

import json from "highlight.js/lib/languages/javascript"
import xml from "highlight.js/lib/languages/xml"

Lowlight.registerLanguage('json', json)
Lowlight.registerLanguage('xml', xml)

export default class LowlightCode extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    className: PropTypes.string
  }

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  render () {
    let { value, className } = this.props
    className = className || ""
    
    return (<Lowlight value={value} className={className} subset={['json', 'xml']} />)
  }
}
