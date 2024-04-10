/**
 * @prettier
 */
import React, { useEffect, useRef, useState } from "react"
import PropTypes from "prop-types"
import get from "lodash/get"
import Editor from "@monaco-editor/react"

const options = {
  readOnly: true,
  domReadOnly:true,
  automaticLayout: true,
  contextMenu: false,
  lightbulb: { enabled: "off" },
  renderValidationDecorations: "off",
  renderWhitespace: "all",
  quickSuggestions: false,
  minimap: { enabled: false },
}

const MonacoHighlighter = ({language, className, code, style}) => {
  const editorRef = useRef(null)
  const [width, setWidth] = useState("100%")

  // The Monaco editor does not properly resize when the window becomes smaller than the editor.
  // This effect listens to the resize event and will calculate the width accordingly.
  useEffect(() => {
    const handleResize = () => {
      if(editorRef.current) {
        const editorNode = editorRef.current.getDomNode()
        const tableNode = editorNode.closest("table")
        if (tableNode) {
          const codeHeaderColumn = tableNode.querySelector(".col_header.response-col_status")
          if (codeHeaderColumn) {
            let updateWidth = tableNode.parentElement.clientWidth - codeHeaderColumn.clientWidth
            if(tableNode.parentElement.classList.contains("responses-inner")) {
              updateWidth -= 40
            }
            setWidth(`${updateWidth}px`)
          }
        }
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  function handleEditorDidMount(editor) {
    if(editor) {
      editorRef.current = editor
    }
  }

  return (
    <Editor
      onMount={handleEditorDidMount}
      width={width}
      theme={style}
      className={className}
      options={options}
      defaultLanguage={language}
      defaultValue={code}
    />
  )
}

MonacoHighlighter.propTypes = {
  language: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.string,
  code: PropTypes.string.isRequired
}

const SyntaxHighlighter = ({
                             language,
                             className = "",
                             getConfigs,
                             syntaxHighlighting = {},
                             children = "",
                           }) => {
  const configs = getConfigs()
  const theme = get(configs, "syntaxHighlight.theme")
  const {styles, defaultStyle} = syntaxHighlighting
  const style =  styles.indexOf(theme) !== -1 ? name : defaultStyle

  return (
    <MonacoHighlighter
      language={language}
      className={className}
      style={style}
      code={children}
    >
    </MonacoHighlighter>
  )
}

SyntaxHighlighter.propTypes = {
  language: PropTypes.string.isRequired,
  className: PropTypes.string,
  getConfigs: PropTypes.func.isRequired,
  syntaxHighlighting: PropTypes.shape({
    styles: PropTypes.object,
    defaultStyle: PropTypes.object,
  }),
  renderPlainText: PropTypes.func,
  children: PropTypes.string,
}

export default SyntaxHighlighter
