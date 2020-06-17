import { Light as SyntaxHighlighter } from "react-syntax-highlighter"

import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript"
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json"
import xml from "react-syntax-highlighter/dist/esm/languages/hljs/xml"
import bash from "react-syntax-highlighter/dist/esm/languages/hljs/bash"
import yaml from "react-syntax-highlighter/dist/esm/languages/hljs/yaml"
import http from "react-syntax-highlighter/dist/esm/languages/hljs/http"

import agate from "react-syntax-highlighter/dist/esm/styles/hljs/agate"

SyntaxHighlighter.registerLanguage("json", json)
SyntaxHighlighter.registerLanguage("js", js)
SyntaxHighlighter.registerLanguage("xml", xml)
SyntaxHighlighter.registerLanguage("yaml", yaml)
SyntaxHighlighter.registerLanguage("http", http)
SyntaxHighlighter.registerLanguage("bash", bash)

const styles = {agate}

export {SyntaxHighlighter, styles}
