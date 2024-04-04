import React, {useEffect, useRef, useState} from "react"
import PropTypes from "prop-types"
import Editor from "@monaco-editor/react"

export const styles = [ "vs", "vs-dark", "hc-black", "hc-light"]

export const getStyle = name => {
   return styles.indexOf(name) !== -1 ? name : "vs-dark"
}

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

export function SyntaxHighlighter({language, className, code, style}) {
  const editorRef = useRef(null)
  const [width, setWidth] = useState("100%")
  const theme = getStyle(style)

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
      theme={theme}
      className={className}
      options={options}
      defaultLanguage={language}
      defaultValue={code}
    />
  )
}

SyntaxHighlighter.propTypes = {
    language: PropTypes.string.isRequired,
    className: PropTypes.string,
    style: PropTypes.string,
    code: PropTypes.string.isRequired
}
