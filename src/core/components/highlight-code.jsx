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

  downloadText = () => {
    let fileToSave = new Blob([this.props.value], {type: "text/plain"})
    saveAs(fileToSave, "response")
  }

  preventYScrollingBeyondElement = (e) => {
    const target = e.target

    var deltaY = e.nativeEvent.deltaY
    var contentHeight = target.scrollHeight
    var visibleHeight = target.offsetHeight
    var scrollTop = target.scrollTop

    const scrollOffset = visibleHeight + scrollTop

    const isScrollingPastTop = scrollTop === 0 && deltaY < 0
    const isScrollingPastBottom = scrollOffset >= contentHeight && deltaY > 0

    if (isScrollingPastTop || isScrollingPastBottom) {
      e.preventDefault()
    }
  }

  render () {
    let { value, className } = this.props
    className = className || ""

    return (
      <div className="highlight-code">
        <div className="download-contents" onClick={this.downloadText}>Download</div>
        <pre
          ref={this.initializeComponent}
          onWheel={this.preventYScrollingBeyondElement}
          className={className + " microlight"}>
          {value}
        </pre>
      </div>
    )
  }
}
