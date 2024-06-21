/**
 * @prettier
 */
import React, { useRef, useEffect, useState } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import saveAs from "js-file-download"
import { CopyToClipboard } from "react-copy-to-clipboard"

const HighlightCode = ({
  fileName = "response.txt",
  className,
  downloadable,
  previewable,
  getComponent,
  canCopy,
  language,
  children,
}) => {
  const rootRef = useRef(null)
  const [previewVisible, setPreviewVisible] = useState(false)
  const SyntaxHighlighter = getComponent("SyntaxHighlighter", true)

  const handleDownload = () => {
    saveAs(children, fileName)
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

  const handlePreviewToggle = () => {
    previewable && setPreviewVisible(!previewVisible)
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
  }, [children, className, language])

  return (
    <div className="highlight-code" ref={rootRef}>
      {previewable && (
        <button className="toggle-html-preview" onClick={handlePreviewToggle}>
          {previewVisible ? "Hide" : "Show"} Preview
        </button>
      )}

      {canCopy && (
        <div className="copy-to-clipboard">
          <CopyToClipboard text={children}>
            <button />
          </CopyToClipboard>
        </div>
      )}

      {!downloadable ? null : (
        <button className="download-contents" onClick={handleDownload}>
          Download
        </button>
      )}

      {previewVisible ? (
        <iframe
          srcDoc={children}
          sandbox="allow-scripts"
        />
      ) : (
        <SyntaxHighlighter
          language={language}
          className={classNames(className, "microlight")}
          renderPlainText={({ children, PlainTextViewer }) => (
            <PlainTextViewer className={className}>{children}</PlainTextViewer>
          )}
        >
          {children}
        </SyntaxHighlighter>
      )}
    </div>
  )
}

HighlightCode.propTypes = {
  getComponent: PropTypes.func.isRequired,
  className: PropTypes.string,
  previewable: PropTypes.bool,
  downloadable: PropTypes.bool,
  fileName: PropTypes.string,
  language: PropTypes.string,
  canCopy: PropTypes.bool,
  children: PropTypes.string.isRequired,
}

export default HighlightCode
