// ES6 + inline style port of JSONViewer https://bitbucket.org/davevedder/react-json-viewer/
// all credits and original code to the author
// Dave Vedder <veddermatic@gmail.com> http://www.eskimospy.com/
// port by Daniele Zannotti http://www.github.com/dzannotti <dzannotti@me.com>

import React from "react"
import { useMemo } from "react"
import { invertTheme } from "react-base16-styling"
import JSONNode from "./JSONNode"
import createStylingFromTheme from "./createStylingFromTheme"

const identity = value => value
const expandRootNode = (_keyPath, _data, level) => level === 0
const defaultItemString = (_type, _data, itemType, itemString) => (
  <span>
    {itemType} {itemString}
  </span>
)
const defaultLabelRenderer = ([label]) => <span>{label}:</span>
const noCustomNode = () => false

export function JSONTree({
  data: value,
  theme,
  invertTheme: shouldInvertTheme,
  keyPath = ["root"],
  labelRenderer = defaultLabelRenderer,
  valueRenderer = identity,
  shouldExpandNodeInitially = expandRootNode,
  hideRoot = false,
  getItemString = defaultItemString,
  postprocessValue = identity,
  isCustomNode = noCustomNode,
  collectionLimit = 50,
  sortObjectKeys = false
}) {
  const styling = useMemo(
    () =>
      createStylingFromTheme(shouldInvertTheme ? invertTheme(theme) : theme),
    [theme, shouldInvertTheme]
  )

  return (
    <ul {...styling("tree")}>
      <JSONNode
        keyPath={hideRoot ? [] : keyPath}
        value={postprocessValue(value)}
        isCustomNode={isCustomNode}
        styling={styling}
        labelRenderer={labelRenderer}
        valueRenderer={valueRenderer}
        shouldExpandNodeInitially={shouldExpandNodeInitially}
        hideRoot={hideRoot}
        getItemString={getItemString}
        postprocessValue={postprocessValue}
        collectionLimit={collectionLimit}
        sortObjectKeys={sortObjectKeys}
      />
    </ul>
  )
}
