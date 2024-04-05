/**
 * @prettier
 */
import React, { useRef, useEffect } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import get from "lodash/get"
import saveAs from "js-file-download"
import { CopyToClipboard } from "react-copy-to-clipboard"

const HighlightCode = ({
  value,
  fileName = "response.txt",
  className,
  downloadable,
  getConfigs,
  getComponent,
  canCopy,
  language,
}) => {
  const config = getConfigs()
  const canSyntaxHighlight =
    get(config, "syntaxHighlight") !== false &&
    get(config, "syntaxHighlight.activated", true)
  const rootRef = useRef(null)

  const SyntaxHighlighter = getComponent("SyntaxHighlighter", true)

  const handleDownload = () => {
    saveAs(value, fileName)
  }

  const handlePreventYScrollingBeyondElement = (e) => {
    const { target, deltaY } = e
    const {
      scrollHeight: contentHeight,
      offsetHeight: visibleHeight,
      scrollTop,
    } = target
    const scrollOffset = visibleHeight + scrollTop
    const isElementScrollable = contentHeight > visibleHeight
    const isScrollingPastTop = scrollTop === 0 && deltaY < 0
    const isScrollingPastBottom = scrollOffset >= contentHeight && deltaY > 0

    if (isElementScrollable && (isScrollingPastTop || isScrollingPastBottom)) {
      e.preventDefault()
    }
  }

  useEffect(() => {
    const childNodes = Array.from(rootRef.current.childNodes).filter(
      (node) => !!node.nodeType && node.classList.contains("microlight")
    )

    // eslint-disable-next-line no-use-before-define
    childNodes.forEach((node) =>
      node.addEventListener(
        "mousewheel",
        handlePreventYScrollingBeyondElement,
        { passive: false }
      )
    )

    return () => {
      // eslint-disable-next-line no-use-before-define
      childNodes.forEach((node) =>
        node.removeEventListener(
          "mousewheel",
          handlePreventYScrollingBeyondElement
        )
      )
    }
  }, [value, className, language])

  return (
    <div className="highlight-code" ref={rootRef}>
      {canCopy && (
        <div className="copy-to-clipboard">
          <CopyToClipboard text={value}>
            <button />
          </CopyToClipboard>
        </div>
      )}

      {!downloadable ? null : (
        <button className="download-contents" onClick={handleDownload}>
          Download
        </button>
      )}

      {canSyntaxHighlight ? (
        <SyntaxHighlighter
          language={language}
          className={classNames(className, "microlight")}
        >
          {value}
        </SyntaxHighlighter>
      ) : (
        <pre className={classNames(className, "microlight")}>{value}</pre>
      )}
    </div>
  )
}

HighlightCode.propTypes = {
  value: PropTypes.string.isRequired,
  getConfigs: PropTypes.func.isRequired,
  getComponent: PropTypes.func.isRequired,
  className: PropTypes.string,
  downloadable: PropTypes.bool,
  fileName: PropTypes.string,
  language: PropTypes.string,
  canCopy: PropTypes.bool,
}

export default HighlightCode
