import { setHash } from "./helpers"
import zenscroll from "zenscroll"
import { createDeepLinkPath } from "core/utils"
import Im, { fromJS } from "immutable"

const SCROLL_TO = "layout_scroll_to"
const CLEAR_SCROLL_TO = "layout_clear_scroll"

export const show = (ori, { getConfigs, layoutSelectors }) => (...args) => {
  ori(...args)

  if(!getConfigs().deepLinking) {
    return
  }

  try {
    let [tokenArray, shown] = args
    //Coerce in to array
    tokenArray = Array.isArray(tokenArray) ? tokenArray : [tokenArray]
    // Convert into something we can put in the URL hash
    // Or return empty, if we cannot
    const urlHashArray = layoutSelectors.urlHashArrayFromIsShownKey(tokenArray) // Will convert

    // No hash friendly list?
    if(!urlHashArray.length)
      return

    const [type, assetName] = urlHashArray

    if (!shown) {
      return setHash("/")
    }

    if (urlHashArray.length === 2) {
      setHash(createDeepLinkPath(`/${encodeURIComponent(type)}/${encodeURIComponent(assetName)}`))
    } else if (urlHashArray.length === 1) {
      setHash(createDeepLinkPath(`/${encodeURIComponent(type)}`))
    }

  } catch (e) {
    // This functionality is not mission critical, so if something goes wrong
    // we'll just move on
    console.error(e) // eslint-disable-line no-console
  }
}

export const scrollTo = (path) => {
  return {
    type: SCROLL_TO,
    payload: Array.isArray(path) ? path : [path]
  }
}

export const parseDeepLinkHash = (rawHash) => ({ layoutActions, layoutSelectors, getConfigs }) => {

  if(!getConfigs().deepLinking) {
    return
  }

  if(rawHash) {
    let hash = rawHash.slice(1) // # is first character


    if(hash[0] === "!") {
      // Parse UI 2.x shebangs
      hash = hash.slice(1)
    }

    if(hash[0] === "/") {
      // "/pet/addPet" => "pet/addPet"
      // makes the split result cleaner
      // also handles forgotten leading slash
      hash = hash.slice(1)
    }

    const hashArray = hash.split("/").map(val => (val || ""))

    const isShownKey = layoutSelectors.isShownKeyFromUrlHashArray(hashArray)

    const [type, tagId = "", maybeOperationId = ""] = isShownKey

    if(type === "operations") {
      // we're going to show an operation, so we need to expand the tag as well
      const tagIsShownKey = layoutSelectors.isShownKeyFromUrlHashArray([tagId])

      // If an `_` is present, trigger the legacy escaping behavior to be safe
      // TODO: remove this in v4.0, it is deprecated
      if(tagId.indexOf("_") > -1) {
        console.warn("Warning: escaping deep link whitespace with `_` will be unsupported in v4.0, use `%20` instead.")
        layoutActions.show(tagIsShownKey.map(val => val.replace(/_/g, " ")), true)
      }

      layoutActions.show(tagIsShownKey, true)
    }

    // If an `_` is present, trigger the legacy escaping behavior to be safe
    // TODO: remove this in v4.0, it is deprecated
    if (tagId.indexOf("_") > -1 || maybeOperationId.indexOf("_") > -1) {
      console.warn("Warning: escaping deep link whitespace with `_` will be unsupported in v4.0, use `%20` instead.")
      layoutActions.show(isShownKey.map(val => val.replace(/_/g, " ")), true)
    }

    layoutActions.show(isShownKey, true)

    // Scroll to the newly expanded entity
    layoutActions.scrollTo(isShownKey)
  }
}

export const readyToScroll = (isShownKey, ref) => (system) => {
  const scrollToKey = system.layoutSelectors.getScrollToKey()

  if(Im.is(scrollToKey, fromJS(isShownKey))) {
    system.layoutActions.scrollToElement(ref)
    system.layoutActions.clearScrollTo()
  }
}

// Scroll to "ref" (dom node) with the scrollbar on "container" or the nearest parent
export const scrollToElement = (ref, container) => (system) => {
  try {
    container = container || system.fn.getScrollParent(ref)
    let myScroller = zenscroll.createScroller(container)
    myScroller.to(ref)
  } catch(e) {
    console.error(e) // eslint-disable-line no-console
  }
}

export const clearScrollTo = () => {
  return {
    type: CLEAR_SCROLL_TO,
  }
}

// From: https://stackoverflow.com/a/42543908/3933724
// Modified to return html instead of body element as last resort
function getScrollParent(element, includeHidden) {
  const LAST_RESORT = document.documentElement
  let style = getComputedStyle(element)
  const excludeStaticParent = style.position === "absolute"
  const overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/

  if (style.position === "fixed")
    return LAST_RESORT
  for (let parent = element; (parent = parent.parentElement);) {
    style = getComputedStyle(parent)
    if (excludeStaticParent && style.position === "static") {
      continue
    }
    if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX))
      return parent
  }

  return LAST_RESORT
}

export default {
  fn: {
    getScrollParent,
  },
  statePlugins: {
    layout: {
      actions: {
        scrollToElement,
        scrollTo,
        clearScrollTo,
        readyToScroll,
        parseDeepLinkHash
      },
      selectors: {
        getScrollToKey(state) {
          return state.get("scrollToKey")
        },
        isShownKeyFromUrlHashArray(state, urlHashArray) {
          // If there are more than 2 segments, treat all segments except the last one as the tag
          if (urlHashArray.length > 2) {
            urlHashArray = [urlHashArray.slice(0, 1).join("/"), urlHashArray.at(-1)]
          }

          const [tag, operationId] = urlHashArray
          // We only put operations in the URL
          if(operationId) {
            return ["operations", tag, operationId]
          } else if (tag) {
            return ["operations-tag", tag]
          }
          return []
        },
        urlHashArrayFromIsShownKey(state, isShownKey) {
          let [type, tag, operationId] = isShownKey
          // We only put operations in the URL
          if(type == "operations") {
            return [tag, operationId]
          } else if (type == "operations-tag") {
            return [tag]
          }
          return []
        },
      },
      reducers: {
        [SCROLL_TO](state, action) {
          return state.set("scrollToKey", Im.fromJS(action.payload))
        },
        [CLEAR_SCROLL_TO](state) {
          return state.delete("scrollToKey")
        }
      },
      wrapActions: {
        show
      }
    }
  }
}
