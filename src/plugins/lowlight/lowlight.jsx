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
    // console.log('render(), props = ', this.props);
    
    let { value, className } = this.props
    className = className || ""
    
    /*
    let ast = low.highlight(language, value).value;
    let html = rehype().stringify({type: 'root', children: ast}).toString();
    
    // TODO This is unefficient and danger. consider change it
    return <pre className={'hljs ' + className} ><code dangerouslySetInnerHTML={ {__html: html} } /></pre>
    */
    
    return (<Lowlight value={value} className={className} subset={['json', 'xml']} />)
  }
}
