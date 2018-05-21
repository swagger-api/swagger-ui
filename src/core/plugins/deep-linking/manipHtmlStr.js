import $ from "jquery"
import isHtml from "is-html"


export default function(htmlStr, selector, callback) {
  if (typeof htmlStr !== "string") {
    throw new Error("A string needs to be passed for htmlStr")
  }

  if (typeof selector !== "string") {
    throw new Error("A string needs to be passed for selector")
  }

  if (typeof callback !== "function") {
    const msg = "A function object needs to be passed for the callback parameter"
    throw new Error(msg)
  }

  if (!isHtml(htmlStr)) {
    throw new Error("Valid html was not passed")
  }

  const children = $($.parseHTML(htmlStr))
  const root = $('<div>').append(children)
  const selectedElems = root.find(selector)
  selectedElems.each(function(index, elem) {
    callback(elem)
  })
  const newStr = root.html()
  return newStr
}
