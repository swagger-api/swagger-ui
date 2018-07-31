import zenscroll from "zenscroll"
import Im from "immutable"

const ADD_PATH_REF_PAIR = "layout_add_path_ref_pair"
const INITIALIZE_PATH_REF_PAIRS = "layout_initialize_path_ref_pairs"
const CLICK_DEEP_LINK = "layout_click_deep_link"





function scrollTo(path, getScrollParent, getPathRefPairs) {
  const pathRefPairs = getPathRefPairs()
  const ref = pathRefPairs.get(path)

  try {
    const container = getScrollParent(ref)
    let myScroller = zenscroll.createScroller(container)
    myScroller.to(ref)
  } catch(e) {
    console.error(e) // eslint-disable-line no-console
  }
}


export const show = (ori) => (...args) => {
  const havePath = (typeof args[0] === "string")
  if (havePath) {
    //Convert path to isShownKey
    args[0] = isShownKeyFromUrlHashArray(args[0].split("/"))
  }
  ori(...args)
}


function isShownKeyFromUrlHashArray(urlHashArray) {
  const [tag, operationId] = urlHashArray
  // We only put operations in the URL
  if(operationId) {
    return ["operations", tag, operationId]
  } else if (tag) {
    return ["operations-tag", tag]
  }
  return []
}


const parseDeepLinkHash = (rawHash) => {
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
    return hash
  }
}


function onDeepLinkClicked(sys, callback) {
  const deepLinkingEnabled = sys.getConfigs().deepLinking
  if (deepLinkingEnabled) {
    window.onhashchange = function() {
      const { deepLinkAlreadyClicked } = sys.layoutSelectors

      if (!deepLinkAlreadyClicked()) {
        const { hash } = window.location
        const { parseDeepLinkHash, scrollTo } = sys.fn
        const { show, clickDeepLink } = sys.layoutActions

        clickDeepLink()

        const path = parseDeepLinkHash(hash)
        callback(path, show, scrollTo)
      }
    }
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




function addPathRefPair(pair) {
  return {
    type: ADD_PATH_REF_PAIR,
    payload: pair
  }
}


function initializePathRefPairs() {
  return {
    type: INITIALIZE_PATH_REF_PAIRS
  }
}


//Used to make sure that deepLinking works only once in the document’s life cycle
function clickDeepLink() {
  return { type: CLICK_DEEP_LINK }
}




export default {
  fn: {
    parseDeepLinkHash,
    onDeepLinkClicked,
    getScrollParent,
    scrollTo
  },
  afterLoad(system) {
    const { initializePathRefPairs } = system.layoutActions
    const { getScrollParent } = system.fn
    const { getPathRefPairs } = system.layoutSelectors

    initializePathRefPairs()

    system.fn.scrollTo = function(path) {
      scrollTo(path, getScrollParent, getPathRefPairs)
    }
  },
  statePlugins: {
    layout: {
      actions: {
        addPathRefPair,
        clickDeepLink,
        initializePathRefPairs
      },
      selectors: {
        getPathRefPairs(state) {
          return state.get("pathRefPairs")
        },
        deepLinkAlreadyClicked(state) {
          const clicked = state.get("deepLinkAlreadyClicked")
          return (clicked ? true : false)
        },
        isShownKeyFromUrlHashArray
      },
      reducers: {
        [ADD_PATH_REF_PAIR](state, action) {
          const path = action.payload[0]
          const ref = action.payload[1]
          var pathRefPairs = state.get("pathRefPairs")
          pathRefPairs = pathRefPairs.set(path, ref)
          return state.set("pathRefPairs", Im.fromJS(pathRefPairs))
        },
        [INITIALIZE_PATH_REF_PAIRS](state) {
          return state.set("pathRefPairs", Im.fromJS({}))
        },
        [CLICK_DEEP_LINK](state) {
          return state.set("deepLinkAlreadyClicked", true)
        }
      },
      wrapActions: { show }      
    }
  }
}
