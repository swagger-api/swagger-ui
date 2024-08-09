import { base16Themes } from "react-base16-styling"
import { JSONTree } from "./react-json-tree"
import React from "react"


let theme = base16Themes.solarized
theme.tree = {
  fontSize: '16px'
};
theme.label = {
  fontSize: '16px'
};
export default function() {
  return {
    wrapComponents: {
      HighlightCode: (Original, {}) => props => {
        const { children } = props
        const canJSON = JSON.parse(children) !== null
        if (canJSON) {
          return (
            <div className="highlight-code">
              <JSONTree
                data={JSON.parse(children)}
                theme={theme}
              />
            </div>
          )
        }
        return <Original {...props} />
      }
    }
  }
}
