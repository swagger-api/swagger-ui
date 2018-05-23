/**
    Uses the URL hash to focus on a deeplink's target. To "focus" means to
    scroll to a tag or expand and scroll to an operation.
**/


import scrollTo from "scroll-to-element"
import { escapeDeepLinkPath } from "core/utils"

const SCROLL_OFFSET = -5
let hasHashBeenParsed = false



export default function(layoutActions, getConfigs) {
  const isDeepLinkingEnabled = getConfigs().deepLinking
  if(!isDeepLinkingEnabled || isDeepLinkingEnabled === "false") {
    return
  }

  if(window.location.hash && !hasHashBeenParsed ) {
    let hash = window.location.hash.slice(1) // # is first character

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

    let [tag, operationId] = hash.split("/")

    if(tag && operationId) {
      // Pre-expand and scroll to the operation
      layoutActions.show(["operations-tag", tag], true)
      layoutActions.show(["operations", tag, operationId], true)

      scrollTo(`#operations-${escapeDeepLinkPath(tag)}-${escapeDeepLinkPath(operationId)}`, {
        offset: SCROLL_OFFSET
      })
    } else if(tag) {
      // Pre-expand and scroll to the tag
      layoutActions.show(["operations-tag", tag], true)

      scrollTo(`#operations-tag-${escapeDeepLinkPath(tag)}`, {
        offset: SCROLL_OFFSET
      })
    }
  }

  hasHashBeenParsed = true
}
