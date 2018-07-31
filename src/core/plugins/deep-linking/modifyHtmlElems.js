import isHtml from "is-html"


export default function(htmlStr, elemName, callback) {
  typeCheck(callback)
  const elems = findElementsByName(htmlStr, elemName)
  if (!elems) {
    return elems
  }
  elems.forEach(function(oldElem) {
    const newElem = callback(oldElem)
    if (newElem) {
      htmlStr = htmlStr.replace(oldElem, newElem)
    }
  })
  return htmlStr
}




function findElementsByName(htmlStr, elemName) {

  if (typeof htmlStr !== "string") {
    throw new Error("A string needs to be passed for htmlStr")
  }
  if (!isHtml(htmlStr)) {
    throw new Error("Valid html was not passed")
  }
  if (typeof elemName !== "string") {
    throw new Error("A string needs to be passed for elemName")
  }

  const openingTag = "<" + elemName
  const closingTag = "</" + elemName
  const elemsOpeningAndClosingIndices = []
  const charsArr = htmlStr.split("")

  charsArr.forEach(function(char, i) {

    const atEndOfHtmlStr = (i+1 == undefined || i+2 == undefined)
    if (atEndOfHtmlStr) return

    const openingTagFound = (htmlStr[i] + htmlStr[i+1]) === openingTag
    if (openingTagFound) {
      const newElemIndicies = []
      const openingIndex = i
      newElemIndicies[0] = openingIndex
      elemsOpeningAndClosingIndices.unshift(newElemIndicies)
    }

    const closingTagFound = (htmlStr[i] + htmlStr[i+1] + htmlStr[i+2]) === closingTag
    if (closingTagFound) {
      const newElemIndicies = elemsOpeningAndClosingIndices[0]
      const closingIndex = i + 3
      newElemIndicies[1] = closingIndex
    }
  })

  const elemsNotFound = (elemsOpeningAndClosingIndices.length === 0)
  if (elemsNotFound) {
    return undefined
  }

  const foundElems = elemsOpeningAndClosingIndices.map(function(currentVal) {
    const elem = htmlStr.substring(currentVal[0], currentVal[1] + 1)
    return elem
  })

  return foundElems
}




function typeCheck(callback) {
  if (typeof callback !== "function") {
    const msg = "A function object needs to be passed for the callback parameter"
    throw new Error(msg)
  }
}
