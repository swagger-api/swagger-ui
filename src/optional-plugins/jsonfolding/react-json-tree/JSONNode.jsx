import React from "react"
import objType from "./objType"
import JSONObjectNode from "./JSONObjectNode"
import JSONArrayNode from "./JSONArrayNode"
import JSONIterableNode from "./JSONIterableNode"
import JSONValueNode from "./JSONValueNode"

export default function JSONNode({
  getItemString,
  keyPath,
  labelRenderer,
  styling,
  value,
  valueRenderer,
  isCustomNode,
  ...rest
}) {
  const nodeType = isCustomNode(value) ? "Custom" : objType(value)

  const simpleNodeProps = {
    getItemString,
    key: keyPath[0],
    keyPath,
    labelRenderer,
    nodeType,
    styling,
    value,
    valueRenderer
  }

  const nestedNodeProps = {
    ...rest,
    ...simpleNodeProps,
    data: value,
    isCustomNode
  }

  switch (nodeType) {
    case "Object":
    case "Error":
    case "WeakMap":
    case "WeakSet":
      return <JSONObjectNode {...nestedNodeProps} />
    case "Array":
      return <JSONArrayNode {...nestedNodeProps} />
    case "Iterable":
    case "Map":
    case "Set":
      return <JSONIterableNode {...nestedNodeProps} />
    case "String":
      return (
        <JSONValueNode {...simpleNodeProps} valueGetter={raw => `"${raw}"`} />
      )
    case "Number":
      return <JSONValueNode {...simpleNodeProps} />
    case "Boolean":
      return (
        <JSONValueNode
          {...simpleNodeProps}
          valueGetter={raw => (raw ? "true" : "false")}
        />
      )
    case "Date":
      return (
        <JSONValueNode
          {...simpleNodeProps}
          valueGetter={raw => raw.toISOString()}
        />
      )
    case "Null":
      return <JSONValueNode {...simpleNodeProps} valueGetter={() => "null"} />
    case "Undefined":
      return (
        <JSONValueNode {...simpleNodeProps} valueGetter={() => "undefined"} />
      )
    case "Function":
    case "Symbol":
      return (
        <JSONValueNode
          {...simpleNodeProps}
          valueGetter={raw => raw.toString()}
        />
      )
    case "Custom":
      return <JSONValueNode {...simpleNodeProps} />
    default:
      return (
        <JSONValueNode
          {...simpleNodeProps}
          valueGetter={() => `<${nodeType}>`}
        />
      )
  }
}
