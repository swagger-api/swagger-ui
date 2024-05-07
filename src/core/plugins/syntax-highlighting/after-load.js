/**
 * @prettier
 */
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/light"
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript"
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json"
import xml from "react-syntax-highlighter/dist/esm/languages/hljs/xml"
import bash from "react-syntax-highlighter/dist/esm/languages/hljs/bash"
import yaml from "react-syntax-highlighter/dist/esm/languages/hljs/yaml"
import http from "react-syntax-highlighter/dist/esm/languages/hljs/http"
import powershell from "react-syntax-highlighter/dist/esm/languages/hljs/powershell"
import javascript from "react-syntax-highlighter/dist/esm/languages/hljs/javascript"

const afterLoad = () => {
  SyntaxHighlighter.registerLanguage("json", json)
  SyntaxHighlighter.registerLanguage("js", js)
  SyntaxHighlighter.registerLanguage("xml", xml)
  SyntaxHighlighter.registerLanguage("yaml", yaml)
  SyntaxHighlighter.registerLanguage("http", http)
  SyntaxHighlighter.registerLanguage("bash", bash)
  SyntaxHighlighter.registerLanguage("powershell", powershell)
  SyntaxHighlighter.registerLanguage("javascript", javascript)
}

export default afterLoad
