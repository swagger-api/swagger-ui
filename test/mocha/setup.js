const { JSDOM } = require("jsdom")
const win = require("core/window")

const jsdom = new JSDOM("<!doctype html><html><body></body></html>")
const { window } = jsdom

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === "undefined")
    .reduce((result, prop) => ({
      ...result,
      [prop]: Object.getOwnPropertyDescriptor(src, prop),
    }), {})
  Object.defineProperties(target, props)
}

global.window = window
global.document = window.document
global.navigator = {
  userAgent: "node.js",
}
copyProps(win, window) // use UI's built-in window wrapper
copyProps(window, global)
