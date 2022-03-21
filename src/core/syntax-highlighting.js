import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/light"
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript"
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json"
import xml from "react-syntax-highlighter/dist/esm/languages/hljs/xml"
import bash from "react-syntax-highlighter/dist/esm/languages/hljs/bash"
import yaml from "react-syntax-highlighter/dist/esm/languages/hljs/yaml"
import http from "react-syntax-highlighter/dist/esm/languages/hljs/http"
import powershell from "react-syntax-highlighter/dist/esm/languages/hljs/powershell"
import javascript from "react-syntax-highlighter/dist/esm/languages/hljs/javascript"

import agate from "react-syntax-highlighter/dist/esm/styles/hljs/agate"
import arta from "react-syntax-highlighter/dist/esm/styles/hljs/arta"
import monokai from "react-syntax-highlighter/dist/esm/styles/hljs/monokai"
import nord from "react-syntax-highlighter/dist/esm/styles/hljs/nord"
import obsidian from "react-syntax-highlighter/dist/esm/styles/hljs/obsidian"
import tomorrowNight from "react-syntax-highlighter/dist/esm/styles/hljs/tomorrow-night"

SyntaxHighlighter.registerLanguage("json", json)
SyntaxHighlighter.registerLanguage("js", js)
SyntaxHighlighter.registerLanguage("xml", xml)
SyntaxHighlighter.registerLanguage("yaml", yaml)
SyntaxHighlighter.registerLanguage("http", http)
SyntaxHighlighter.registerLanguage("bash", bash)
SyntaxHighlighter.registerLanguage("powershell", powershell)
SyntaxHighlighter.registerLanguage("javascript", javascript)

const styles = {agate, arta, monokai, nord, obsidian, "tomorrow-night": tomorrowNight}
export const availableStyles = Object.keys(styles)

export const getStyle = name => {
    if (!availableStyles.includes(name)) {
        console.warn(`Request style '${name}' is not available, returning default instead`)
        return agate
    }
    return styles[name]
}

export {SyntaxHighlighter, styles}
