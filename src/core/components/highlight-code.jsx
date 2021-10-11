import React, { Component } from "react"
import PropTypes from "prop-types"
import get from "lodash/get"
import saveAs from "js-file-download"
import { CopyToClipboard } from "react-copy-to-clipboard"
import ReactDOM from "react-dom"

export default class HighlightCode extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    fn: PropTypes.object.isRequired,
    getConfigs: PropTypes.func.isRequired,
    getComponent: PropTypes.func.isRequired,
    className: PropTypes.string,
    downloadable: PropTypes.bool,
    fileName: PropTypes.string,
    language: PropTypes.string,
    canCopy: PropTypes.bool
  }

  #syntaxHighlighter;
  #pre;

  downloadText = () => {
    saveAs(this.props.value, this.props.fileName || "response.txt")
  }

  preventYScrollingBeyondElement = (e) => {
    const target = e.target

    const deltaY = e.deltaY
    const contentHeight = target.scrollHeight
    const visibleHeight = target.offsetHeight
    const scrollTop = target.scrollTop

    const scrollOffset = visibleHeight + scrollTop

    const isElementScrollable = contentHeight > visibleHeight
    const isScrollingPastTop = scrollTop === 0 && deltaY < 0
    const isScrollingPastBottom = scrollOffset >= contentHeight && deltaY > 0

    if (isElementScrollable && (isScrollingPastTop || isScrollingPastBottom)) {
      e.preventDefault()
    }
  }


  componentDidMount() {
    const extractAddEventListener = (el) => (el?.addEventListener || ReactDOM.findDOMNode(el)?.addEventListener || (() => {}))
    [this.#syntaxHighlighter, this.#pre]
      .map((el) => extractAddEventListener(el)("mousewheel", this.preventYScrollingBeyondElement, { passive: false }))
  }

  componentWillUnmount() {
    const extractRemoveEventListener = (el) => (el?.removeEventListener || ReactDOM.findDOMNode(el)?.removeEventListener || (() => {}))
    [this.#syntaxHighlighter, this.#pre]
      .map((el) => extractRemoveEventListener(el)("mousewheel", this.preventYScrollingBeyondElement))
  }

  render () {
    let { value, className, downloadable, getConfigs, canCopy, language, fn, getComponent } = this.props

    const config = getConfigs ? getConfigs() : {syntaxHighlight: {activated: true, theme: "agate"}}

    className = className || ""
    const SyntaxHighlighter = getComponent("SyntaxHighlighter")
    const codeBlock = get(config, "syntaxHighlight.activated")
      ? <SyntaxHighlighter
          ref={elem => this.#syntaxHighlighter = elem}
          language={language}
          className={className + " microlight"}
          style={fn.getStyle(get(config, "syntaxHighlight.theme"))}
          >
          {value}
        </SyntaxHighlighter>
      : <pre ref={elem => this.#pre = elem} className={className + " microlight"}>{value}</pre>

    return (
      <div className="highlight-code">
        { !downloadable ? null :
          <div className="download-contents" onClick={this.downloadText}>
            Download
          </div>
        }

        { !canCopy ? null :
          <div className="copy-to-clipboard">
            <CopyToClipboard text={value}><button/></CopyToClipboard>
          </div>
        }

        { codeBlock }
      </div>
    )
  }
}
