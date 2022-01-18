const { JSDOM } = require("jsdom")
const Enzyme = require("enzyme")
const Adapter = require("@wojtekmaj/enzyme-adapter-react-17")

const win = require("../../src/core/window")

Enzyme.configure({ adapter: new Adapter() })

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
