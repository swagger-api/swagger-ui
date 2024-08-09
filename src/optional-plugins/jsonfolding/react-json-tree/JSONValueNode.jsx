import React from "react"

export default function JSONValueNode({
  nodeType,
  styling,
  labelRenderer,
  keyPath,
  valueRenderer,
  value,
  valueGetter = value => value
}) {
  return (
    <li {...styling("value", nodeType, keyPath)}>
      <label {...styling(["label", "valueLabel"], nodeType, keyPath)}>
        {labelRenderer(keyPath, nodeType, false, false)}
      </label>
      <span {...styling("valueText", nodeType, keyPath)}>
        {valueRenderer(valueGetter(value), value, ...keyPath)}
      </span>
    </li>
  )
}
