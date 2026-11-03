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
import a11yDark from "react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark"
import a11yLight from "react-syntax-highlighter/dist/esm/styles/hljs/a11y-light"

export const styles = {
  agate,
  arta,
  monokai,
  nord,
  obsidian,
  "tomorrow-night": tomorrowNight,
  idea,
  "a11y-dark": a11yDark,
  "a11y-light": a11yLight,
}

export const defaultStyle = a11yDark
