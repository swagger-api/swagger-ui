import scrollTo from "scroll-to-element"

const SCROLL_OFFSET = -5
let hasHashBeenParsed = false


export const updateResolved = (ori, { layoutActions, getConfigs }) => (...args) => {
  ori(...args)

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
      scrollTo(`#operations-${tag}-${operationId}`, {
        offset: SCROLL_OFFSET
      })
      layoutActions.show(["operations", tag, operationId], true)
    } else if(tag) {
      // Pre-expand and scroll to the tag
      scrollTo(`#operations-tag-${tag}`, {
        offset: SCROLL_OFFSET
      })
      layoutActions.show(["operations-tag", tag], true)
    }
  }

  hasHashBeenParsed = true
}
