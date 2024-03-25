import React, {useEffect, useRef, useState} from "react";
import Editor from '@monaco-editor/react';

export const styles =
  {
    agate: 'catppuccin-mocha',
    arta: 'dracula-soft',
    monokai: 'monokai',
    nord: 'nord',
    obsidian: 'aurora-x',
    "tomorrow-night": 'poimandres',
    idea: 'github-light'
  }

export const getStyle = name => {
  //if (!availableStyles.includes(name)) {
  if (Object.keys(styles).indexOf(name) === -1) {
    console.warn(`Request style '${name}' is not available, returning default instead`)
    return styles['agate'];
  }
  return styles[name]
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

export function SyntaxHighlighter({language, className, style, code}) {
  const editorRef = useRef(null);
  const [width, setWidth] = useState("100%")

  // The Monaco editor does not properly resize when the windows becomes smaller than the editor.
  // This effect listens to the resize event and will calculate the width accordingly.
  useEffect(() => {
    const handleResize = () => {
      if(editorRef.current) {
        const editorNode = editorRef.current.getDomNode();
        const tableNode = editorNode.closest("table");
        if (tableNode) {
          const codeHeaderColumn = tableNode.querySelector(".col_header.response-col_status");
          if (codeHeaderColumn) {
            let updateWidth = tableNode.parentElement.clientWidth - codeHeaderColumn.clientWidth;
            if(tableNode.parentElement.classList.contains("responses-inner")) {
              updateWidth -= 40;
            }
            setWidth(`${updateWidth}px`);
          }
        }
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function handleEditorDidMount(editor, monaco) {
    if(editor) {
        editorRef.current = editor;
      }
  }

  return (
    <Editor
      onMount={handleEditorDidMount}
      width={width}
      theme="vs-dark"
      className={className}
      options={options}
      defaultLanguage={language}
      defaultValue={code}
    />
  );
}
