import React, { useCallback, useState } from "react"
import JSONArrow from "./JSONArrow"

export default function ItemRange(props) {
  const { styling, from, to, renderChildNodes, nodeType } = props

  const [expanded, setExpanded] = useState(false)
  const handleClick = useCallback(() => {
    setExpanded(!expanded)
  }, [expanded])

  return expanded ? (
    <div {...styling("itemRange", expanded)}>
      {renderChildNodes(props, from, to)}
    </div>
  ) : (
    <div {...styling("itemRange", expanded)} onClick={handleClick}>
      <JSONArrow
        nodeType={nodeType}
        styling={styling}
        expanded={false}
        onClick={handleClick}
        arrowStyle="double"
      />
      {`${from} ... ${to}`}
    </div>
  )
}
