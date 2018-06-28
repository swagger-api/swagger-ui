import React, { Component } from "react"
import PropTypes from "prop-types"
import saveAs from "js-file-download"

export default class PreviewHtml extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    className: PropTypes.string,
    downloadable: PropTypes.bool,
    fileName: PropTypes.string
  }


  downloadText = () => {
    saveAs(this.props.value, this.props.fileName || "response.txt")
  }

  preventYScrollingBeyondElement = (e) => {
    const target = e.target

    var deltaY = e.nativeEvent.deltaY
    var contentHeight = target.scrollHeight
    var visibleHeight = target.offsetHeight
    var scrollTop = target.scrollTop

    const scrollOffset = visibleHeight + scrollTop

    const isElementScrollable = contentHeight > visibleHeight
    const isScrollingPastTop = scrollTop === 0 && deltaY < 0
    const isScrollingPastBottom = scrollOffset >= contentHeight && deltaY > 0

    if (isElementScrollable && (isScrollingPastTop || isScrollingPastBottom)) {
      e.preventDefault()
    }
  }

  render () {
    let { value, className, downloadable } = this.props
    className = className || ""

    return (
      <div className="preview-html">
        { !downloadable ? null :
          <div className="download-contents" onClick={this.downloadText}>
            Download
          </div>
        }
        <iframe
          onWheel={this.preventYScrollingBeyondElement}
          className={className + " microlight"}
          src={"data:text/html," + encodeURIComponent(value)}>
        </iframe>
      </div>
    )
  }
}
