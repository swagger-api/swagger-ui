import React, { Component } from "react"
import PropTypes from "prop-types"
import {SyntaxHighlighter, getStyle} from "core/syntax-highlighting"
import get from "lodash/get"
import saveAs from "js-file-download"

export default class HighlightCode extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    getConfigs: PropTypes.func.isRequired,
    className: PropTypes.string,
    downloadable: PropTypes.bool,
    fileName: PropTypes.string,
    canCopy: PropTypes.bool,
    getComponent: PropTypes.func.isRequired
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
    let { value, className, downloadable, getConfigs, canCopy, getComponent } = this.props

    const config = getConfigs ? getConfigs() : {syntaxHighlight: {activated: true, theme: "agate"}}

    className = className || ""

    const codeBlock = get(config, "syntaxHighlight.activated")
      ? <SyntaxHighlighter
          className={className + " microlight"}
          onWheel={this.preventYScrollingBeyondElement}
          style={getStyle(get(config, "syntaxHighlight.theme"))}
          >
          {value}
        </SyntaxHighlighter>
      : <pre onWheel={this.preventYScrollingBeyondElement} className={className + " microlight"}>{value}</pre>

    const Copy = getComponent("Copy")

    return (
      <div className="highlight-code">
        { !downloadable ? null :
          <div className="download-contents" onClick={this.downloadText}>
            Download
          </div>
        }

        { !canCopy ? null :
          <Copy text={value} />
        }

        { codeBlock }
      </div>
    )
  }
}
