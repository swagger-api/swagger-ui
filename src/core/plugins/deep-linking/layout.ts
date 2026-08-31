/**
 * @prettier
 */
import { setHash } from "./helpers"
import zenscroll from "zenscroll"
import { createDeepLinkPath } from "core/utils"
import { fromJS, Map, is, List } from "immutable"

// Action types
const SCROLL_TO = "layout_scroll_to"
const CLEAR_SCROLL_TO = "layout_clear_scroll"

// Type definitions
type LayoutState = Map<string, List<string> | undefined>
type ShowKey = string[]
type UrlHashArray = string[]

interface Action {
  type: string
  payload?: unknown
}

interface ScrollToAction extends Action {
  type: typeof SCROLL_TO
  payload: string[]
}

interface ClearScrollToAction extends Action {
  type: typeof CLEAR_SCROLL_TO
}

interface LayoutSelectors {
  urlHashArrayFromIsShownKey: (key: ShowKey) => UrlHashArray
  isShownKeyFromUrlHashArray: (hashArray: UrlHashArray) => ShowKey
  getScrollToKey: () => List<string> | undefined
}

interface LayoutActions {
  show: (key: ShowKey, shown: boolean) => void
  scrollTo: (key: ShowKey) => void
  scrollToElement: (ref: Element, container?: Element) => void
  clearScrollTo: () => void
}

type GetConfigs = () => { deepLinking?: boolean }

interface System {
  layoutSelectors: LayoutSelectors
  layoutActions: LayoutActions
  fn: {
    getScrollParent: (element: Element, includeHidden?: boolean) => Element
  }
}

type ShowArgs = [tokenArray: string | string[], shown: boolean]
type OriShowFunction = (...args: ShowArgs) => void

export const show =
  (
    ori: OriShowFunction,
    {
      getConfigs,
      layoutSelectors,
    }: { getConfigs: GetConfigs; layoutSelectors: LayoutSelectors }
  ) =>
  (...args: ShowArgs): void => {
    ori(...args)

    if (!getConfigs().deepLinking) {
      return
    }

    try {
      const [tokenArrayArg, shown] = args
      // Coerce into array
      const tokenArray = Array.isArray(tokenArrayArg)
        ? tokenArrayArg
        : [tokenArrayArg]
      // Convert into something we can put in the URL hash
      // Or return empty, if we cannot
      const urlHashArray =
        layoutSelectors.urlHashArrayFromIsShownKey(tokenArray)

      // No hash-friendly list?
      if (!urlHashArray.length) return

      const [type, assetName] = urlHashArray

      if (!shown) {
        setHash("/")
        return
      }

      if (urlHashArray.length === 2) {
        setHash(
          createDeepLinkPath(
            `/${encodeURIComponent(type)}/${encodeURIComponent(assetName)}`
          )
        )
      } else if (urlHashArray.length === 1) {
        setHash(createDeepLinkPath(`/${encodeURIComponent(type)}`))
      }
    } catch (e) {
      // This functionality is not mission-critical, so if something goes wrong,
      // we'll just move on
      console.error(e) // eslint-disable-line no-console
    }
  }

export const scrollTo = (path: string | string[]): ScrollToAction => {
  return {
    type: SCROLL_TO,
    payload: Array.isArray(path) ? path : [path],
  }
}

export const parseDeepLinkHash =
  (rawHash: string) =>
  ({
    layoutActions,
    layoutSelectors,
    getConfigs,
  }: {
    layoutActions: LayoutActions
    layoutSelectors: LayoutSelectors
    getConfigs: GetConfigs
  }): void => {
    if (!getConfigs().deepLinking) {
      return
    }

    if (rawHash) {
      let hash = rawHash.slice(1) // # is first character

      if (hash.startsWith("!")) {
        // Parse UI 2.x shebangs
        hash = hash.slice(1)
      }

      if (hash.startsWith("/")) {
        // "/pet/addPet" => "pet/addPet"
        // makes the split result cleaner
        // also handles forgotten leading slash
        hash = hash.slice(1)
      }

      const hashArray = hash.split("/").map((val) => val || "")

      const isShownKey = layoutSelectors.isShownKeyFromUrlHashArray(hashArray)

      const [type, tagId = "", maybeOperationId = ""] = isShownKey

      if (type === "operations") {
        // we're going to show an operation, so we need to expand the tag as well
        const tagIsShownKey = layoutSelectors.isShownKeyFromUrlHashArray([
          tagId,
        ])

        // If an `_` is present, trigger the legacy-escaping behavior to be safe
        // TODO: remove this in a future 5.x release, it is deprecated
        if (tagId.includes("_")) {
          console.error(
            "Deprecated: escaping deep link whitespace with `_` is unsupported and will be removed in a future 5.x release. Use `%20` instead."
          )
          layoutActions.show(
            tagIsShownKey.map((val) => val.replace(/_/g, " ")),
            true
          )
        }

        layoutActions.show(tagIsShownKey, true)
      }

      // If an `_` is present, trigger the legacy-escaping behavior to be safe
      // TODO: remove this in a future 5.x release, it is deprecated
      if (tagId.includes("_") || maybeOperationId.includes("_")) {
        console.error(
          "Deprecated: escaping deep link whitespace with `_` is unsupported and will be removed in a future 5.x release. Use `%20` instead."
        )
        layoutActions.show(
          isShownKey.map((val) => val.replace(/_/g, " ")),
          true
        )
      }

      layoutActions.show(isShownKey, true)

      // Scroll to the newly expanded entity
      layoutActions.scrollTo(isShownKey)
    }
  }

export const readyToScroll =
  (showKey: ShowKey, ref: Element) =>
  (system: System): void => {
    const scrollToKey = system.layoutSelectors.getScrollToKey()

    if (is(scrollToKey, fromJS(showKey))) {
      system.layoutActions.scrollToElement(ref)
      system.layoutActions.clearScrollTo()
    }
  }

// Scroll to "ref" (dom node) with the scrollbar on "container" or the nearest parent
export const scrollToElement =
  (ref: Element, container?: Element) =>
  (system: System): void => {
    try {
      const scrollContainer = container || system.fn.getScrollParent(ref)
      const myScroller = zenscroll.createScroller(scrollContainer)
      myScroller.to(ref)
    } catch (e) {
      console.error(e) // eslint-disable-line no-console
    }
  }

export const clearScrollTo = (): ClearScrollToAction => {
  return {
    type: CLEAR_SCROLL_TO,
  }
}

/**
 * Finds the nearest ancestor element that can scroll.
 * @param element - The starting element
 * @param includeHidden - Whether to consider overflow:hidden as scrollable
 * @returns The scrollable ancestor, or document.documentElement if none is found
 */
function getScrollParent(
  element: Element,
  includeHidden: boolean = false
): Element {
  const scrollableValues = includeHidden
    ? ["auto", "scroll", "hidden"]
    : ["auto", "scroll"]

  const isScrollable = (el: Element): boolean => {
    const computedStyle = window.getComputedStyle(el)
    const overflowY = computedStyle.overflowY
    const overflowX = computedStyle.overflowX
    return (
      scrollableValues.includes(overflowY) ||
      scrollableValues.includes(overflowX)
    )
  }

  const elementStyle = window.getComputedStyle(element)

  // Fixed position elements scroll with the viewport
  if (elementStyle.position === "fixed") {
    return document.documentElement
  }

  const skipStaticParents = elementStyle.position === "absolute"
  let currentNode = element.parentElement

  while (currentNode !== null) {
    const parentStyle = window.getComputedStyle(currentNode)

    // Absolute elements only scroll with non-static-positioned ancestors
    if (skipStaticParents && parentStyle.position === "static") {
      currentNode = currentNode.parentElement
      continue
    }

    if (isScrollable(currentNode)) {
      return currentNode
    }

    currentNode = currentNode.parentElement
  }

  return document.documentElement
}

// Plugin export
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
        parseDeepLinkHash,
      },
      selectors: {
        getScrollToKey(state: LayoutState): List<string> | undefined {
          return state.get("scrollToKey")
        },
        isShownKeyFromUrlHashArray(
          _state: LayoutState,
          urlHashArray: UrlHashArray
        ): ShowKey {
          const [tag, operationId] = urlHashArray
          // We only put operations in the URL
          if (operationId) {
            return ["operations", tag, operationId]
          } else if (tag) {
            return ["operations-tag", tag]
          }
          return []
        },
        urlHashArrayFromIsShownKey(
          _state: LayoutState,
          showKey: ShowKey
        ): UrlHashArray {
          const [type, tag, operationId] = showKey
          // We only put operations in the URL
          if (type === "operations") {
            return [tag, operationId]
          } else if (type === "operations-tag") {
            return [tag]
          }
          return []
        },
      },
      reducers: {
        [SCROLL_TO](state: LayoutState, action: ScrollToAction): LayoutState {
          return state.set("scrollToKey", fromJS(action.payload))
        },
        [CLEAR_SCROLL_TO](state: LayoutState): LayoutState {
          return state.delete("scrollToKey")
        },
      },
      wrapActions: {
        show,
      },
    },
  },
}
