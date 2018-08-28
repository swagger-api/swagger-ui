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
      setHash(createDeepLinkPath(`/${type}/${assetName}`))
    } else if (urlHashArray.length === 1) {
      setHash(createDeepLinkPath(`/${type}`))
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

    const hashArray = hash.split("/").map(val => (val || "").replace(/_/g, " "))

    const isShownKey = layoutSelectors.isShownKeyFromUrlHashArray(hashArray)

    const [type, tagId] = isShownKey

    if(type === "operations") {
      // we're going to show an operation, so we need to expand the tag as well
      layoutActions.show(layoutSelectors.isShownKeyFromUrlHashArray([tagId]))
    }

    layoutActions.show(isShownKey, true) // TODO: 'show' operation tag
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
