import win from "../../src/core/window"
// import { configure } from "enzyme" // enzyme@3
// import Adapter from "enzyme-adapter-react-15" // enzyme@3
import { JSDOM } from "jsdom"


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
}

setUpDomEnvironment()

// configure({ adapter: new Adapter() }) // enzyme@3
