import React, { Component } from "react"
import PropTypes from "prop-types"
import { highlight } from "core/utils"
import { saveAs } from "file-saver"

export default class HighlightCode extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    className: PropTypes.string
  }

  componentDidMount() {
    highlight(this.el)
  }

  componentDidUpdate() {
    highlight(this.el)
  }

  initializeComponent = (c) => {
    this.el = c
  }

  downloadJSON = () => {
    let fileToSave = new Blob([this.props.value], {type: "text/plain"})
    saveAs(fileToSave, "response")
  }

  render () {
    let { value, className } = this.props
    className = className || ""

    return (
      <div className="highlight-code">
        <div className="download-contents" onClick={this.downloadJSON}>Download</div>
        <pre ref={this.initializeComponent} className={className + " microlight"}>{value}</pre>
      </div>
    )
  }
}
