import React from "react"

export default function JSONArrow({
  styling,
  arrowStyle = "single",
  expanded,
  nodeType,
  onClick
}) {
  return (
    <div {...styling("arrowContainer", arrowStyle)} onClick={onClick}>
      <div {...styling(["arrow", "arrowSign"], nodeType, expanded, arrowStyle)}>
        {"\u25B6"}
        {arrowStyle === "double" && (
          <div {...styling(["arrowSign", "arrowSignInner"])}>{"\u25B6"}</div>
        )}
      </div>
    </div>
  )
}
