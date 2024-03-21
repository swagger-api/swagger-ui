// import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/light"
// import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript"
// import json from "react-syntax-highlighter/dist/esm/languages/hljs/json"
// import xml from "react-syntax-highlighter/dist/esm/languages/hljs/xml"
// import bash from "react-syntax-highlighter/dist/esm/languages/hljs/bash"
// import yaml from "react-syntax-highlighter/dist/esm/languages/hljs/yaml"
// import http from "react-syntax-highlighter/dist/esm/languages/hljs/http"
// import powershell from "react-syntax-highlighter/dist/esm/languages/hljs/powershell"
// import javascript from "react-syntax-highlighter/dist/esm/languages/hljs/javascript"
//
// import agate from "react-syntax-highlighter/dist/esm/styles/hljs/agate"
// import arta from "react-syntax-highlighter/dist/esm/styles/hljs/arta"
// import monokai from "react-syntax-highlighter/dist/esm/styles/hljs/monokai"
// import nord from "react-syntax-highlighter/dist/esm/styles/hljs/nord"
// import obsidian from "react-syntax-highlighter/dist/esm/styles/hljs/obsidian"
// import tomorrowNight from "react-syntax-highlighter/dist/esm/styles/hljs/tomorrow-night"
// import idea from "react-syntax-highlighter/dist/esm/styles/hljs/idea"
//
// SyntaxHighlighter.registerLanguage("json", json)
// SyntaxHighlighter.registerLanguage("js", js)
// SyntaxHighlighter.registerLanguage("xml", xml)
// SyntaxHighlighter.registerLanguage("yaml", yaml)
// SyntaxHighlighter.registerLanguage("http", http)
// SyntaxHighlighter.registerLanguage("bash", bash)
// SyntaxHighlighter.registerLanguage("powershell", powershell)
// SyntaxHighlighter.registerLanguage("javascript", javascript)
//

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
// export const availableStyles = Object.keys(styles)
//
export const getStyle = name => {
  //if (!availableStyles.includes(name)) {
  if (Object.keys(styles).indexOf(name) === -1) {
    console.warn(`Request style '${name}' is not available, returning default instead`)
    return styles['agate'];
  }
  return styles[name]
}
//
// export {SyntaxHighlighter, styles}

const options = {
  readOnly: true,
  domReadOnly:true,
  automaticLayout: true,
  contextMenu: false,
  lightbulb: { enabled: false },
  renderValidationDecorations: "off",
  renderWhitespace: "all",
  quickSuggestions: false
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

  return (<Editor onMount={handleEditorDidMount}  width={width} className={className} options={options}
            defaultLanguage={language} defaultValue={code} />);
}
