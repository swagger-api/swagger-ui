import zenscroll from "zenscroll"
import Im from "immutable"

const ADD_PATH_REF_PAIR = "layout_add_path_ref_pair"
const INITIALIZE_PATH_REF_PAIRS = "layout_initialize_path_ref_pairs"





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




export default {
  afterLoad(system) {
    const { initializePathRefPairs } = system.layoutActions
    initializePathRefPairs()
  },
  statePlugins: {
    layout: {
      actions: {
        addPathRefPair,
        initializePathRefPairs
      },
      selectors: {
        getPathRefPairs(state) {
          return state.get("pathRefPairs")
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
        }
      }
    }
  }
}
