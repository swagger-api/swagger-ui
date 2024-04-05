/**
 * @prettier
 */
import agate from "react-syntax-highlighter/dist/esm/styles/hljs/agate"
import arta from "react-syntax-highlighter/dist/esm/styles/hljs/arta"
import monokai from "react-syntax-highlighter/dist/esm/styles/hljs/monokai"
import nord from "react-syntax-highlighter/dist/esm/styles/hljs/nord"
import obsidian from "react-syntax-highlighter/dist/esm/styles/hljs/obsidian"
import tomorrowNight from "react-syntax-highlighter/dist/esm/styles/hljs/tomorrow-night"
import idea from "react-syntax-highlighter/dist/esm/styles/hljs/idea"

export const styles = {
  agate,
  arta,
  monokai,
  nord,
  obsidian,
  "tomorrow-night": tomorrowNight,
  idea,
}

export const defaultStyle = agate
