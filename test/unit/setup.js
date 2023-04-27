import { JSDOM } from "jsdom"
import Enzyme from "enzyme"
import Adapter from "@wojtekmaj/enzyme-adapter-react-17"

import win from "../../src/core/window"

Enzyme.configure({ adapter: new Adapter() })

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === "undefined")
    .reduce((result, prop) => ({
      ...result,
      [prop]: Object.getOwnPropertyDescriptor(src, prop),
    }), {})
  Object.defineProperties(target, props)
}

function setUpDomEnvironment() {
  const jsdom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost/",
  })
  const { window } = jsdom

  global.window = window
  global.document = window.document
  global.navigator = {
    userAgent: "node.js",
  }
  copyProps(win, window) // use UI's built-in window wrapper
  copyProps(window, global)
  
  // https://github.com/jsdom/jsdom/issues/1721
  if (typeof global.window.URL.createObjectURL === "undefined") {
    Object.defineProperty(global.window.URL, "createObjectURL", { value: () => "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==" })
  }
}

setUpDomEnvironment()

// configure({ adapter: new Adapter() }) // enzyme@3
