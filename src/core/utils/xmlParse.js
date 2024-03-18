/**
 * @prettier
 */

const traverseXML = (node, result = {}) => {
  if (node.nodeType === 1) {
    // ELEMENT_NODE - parameter
    const name = node.nodeName

    if (node.nodeName === "parsererror") {
      throw new Error("Parameter string value must be valid XML")
    }

    const childNodes = Array.from(node.childNodes)

    if (childNodes.length === 1) {
      // only one child node - value of the parameter
      result[name] = traverseXML(childNodes[0])
    } else if (childNodes.length > 0) {
      // more than one child node - the parameter is an object or an array
      const traversedChildren = childNodes.map((child) => traverseXML(child))
      result[name] = traversedChildren.reduce((paramObj, child) => {
        Object.entries(child).forEach(([key, value]) => {
          paramObj[key] = value
        })
        return paramObj
      }, {})
    }
    return result
  } else if (node.nodeType === 3) {
    // TEXT_NODE - value of a parameter (parent node)
    return node.nodeValue
  }
  return undefined
}

export const parseXML = (xml) => {
  try {
    xml = new DOMParser().parseFromString(xml, "application/xml")
    xml = traverseXML(xml.childNodes[0])
    return Object.values(xml)[0]
  } catch (e) {
    return { xmlError: e.message }
  }
}
